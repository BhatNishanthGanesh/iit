const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3100;

const dbconnect = async () => {
  try {
    await mongoose.connect('mongodb+srv://hack:hack123@cluster0.1q5ld9s.mongodb.net/nishu', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }
};

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

// Wrap the server start in the database connection promise
dbconnect().then(startServer);

const productSchema = new mongoose.Schema({
  name: String,
  prices: {
    type: [Number],
    validate: {
      validator: function (v) {
        return v.length === 3; // Ensure the array has exactly 3 elements
      },
      message: 'Prices array must have exactly 3 elements',
    },
    required: true,
  },
  img: String,
});

const Product = mongoose.model('Product', productSchema);

app.post('/products', async (req, res) => {
  try {
    const { name, prices, img } = req.body;

    if (!name || !prices || prices.length !== 3) {
      return res.status(400).json({ error: 'Name and a prices array with exactly 3 elements are required' });
    }

    const newProduct = new Product({ name, prices, img });
    await newProduct.save();

    res.json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function searchECommerce(site, productTitle) {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  try {
    // Navigate to the specified e-commerce site
    const searchUrl = site === 'amazon' ?
      'https://www.amazon.com' :
      'https://www.flipkart.com';

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    // Type the product title in the search box
    const searchBoxSelector = site === 'amazon' ? '#twotabsearchtextbox' : 'input[name="q"]';
    await page.waitForSelector(searchBoxSelector, { visible: true });
    await page.type(searchBoxSelector, productTitle);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // Extract product information from the search results
    const productInfo = await page.evaluate(() => {
      const products = [];

      if (window.location.hostname.includes('amazon')) {
        // Amazon
        const productContainers = document.querySelectorAll('div[data-asin]');

        for (const container of productContainers) {
          const titleElement = container.querySelector('h2 a span');
          const priceElement = container.querySelector('.a-offscreen');
          const imageElement = container.querySelector('img');
          const productId = container.getAttribute('data-asin') || null;

          if (titleElement && priceElement) {
            const title = titleElement.innerText.trim();
            const price = priceElement.innerText.trim();
            const image = imageElement ? imageElement.src : null;

            products.push({
              title,
              price,
              image,
              productId
            });
          }
        }
      } else if (window.location.hostname.includes('flipkart')) {
        // Flipkart
        const productContainers = document.querySelectorAll('div._1AtVbE');

        for (const container of productContainers) {
          const titleElement = container.querySelector('a._1fQZEK');
          const titlElement = container.querySelector('div._4rR01T');
          const priceElement = container.querySelector('div._30jeq3');
          const productIdElement = container.querySelector('div._1AtVbE div[data-id]');
          const productId = productIdElement ? productIdElement.getAttribute('data-id') : null;
          const imageElement = container.querySelector('img');

          if (titleElement && priceElement) {
            const title = titlElement.textContent;
            const price = priceElement.innerText?.trim() || 'N/A';
            const image = imageElement?.src || null;

            products.push({
              title,
              price,
              image,
              productId
            });
          }
        }
      }

      return products;
    });

    return productInfo;
  } finally {
    await browser.close();
  }
}


app.post('/search', async (req, res) => {
  const { title } = req.body;
  const websites = ['amazon', 'flipkart'];

  try {
    const results = await Promise.all(websites.map(site => searchECommerce(site, title)));
    res.json(results);
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({
      error: 'Failed to perform the search'
    });
  }
});



app.delete('/products/:name', (req, res) => {
    const itemName = req.params.name;
  
    Product.findOneAndDelete({ name: itemName }, (err) => {
      if (!err) {
        console.log(`Successfully deleted item with name: ${itemName}`);
        res.send(`Successfully deleted item with name: ${itemName}`);
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
  });


app.get('/fav', async (req, res) => {
  try {
    const favorites = await Product.find();
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});