const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const nodemailer = require("nodemailer");

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
  currentPrice: Number, // Single price for simplicity
  img: String,
  platform: { type: String, enum: ['amazon', 'flipkart'] }, // New field for platform
});

const Product = mongoose.model('Product', productSchema);

app.post('/products', async (req, res) => {
  try {
    const { name, currentPrice, img, platform } = req.body;

    if (!name || !currentPrice || !platform) {
      return res.status(400).json({ error: 'Name, currentPrice, and platform are required' });
    }

    const newProduct = new Product({ name, currentPrice, img, platform });
    await newProduct.save();

    res.json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





const printConsoleNotification = (productName, currentPrice, trackPrice) => {
  console.log(`Price Drop Alert for ${productName}: The price has dropped from ${trackPrice} to ${currentPrice}.`);
};

// ... (previous code remains unchanged)

// ... (previous code remains unchanged)
cron.schedule('*/10 * * * *', async () => {
  try {
    console.log('Cron job started');

    const allProducts = await Product.find();

    for (const product of allProducts) {
      const currentProductInfo = await searchECommerce(product.platform, product.name);

      // Check if the array is not empty before accessing its elements
      if (currentProductInfo && currentProductInfo.length > 0) {
        // Extract numeric part from the string and convert to float
        const currentPrice = parseFloat(currentProductInfo[0].currentPrice.replace(/[^\d.]/g, ''));

        // Update the current price in the database
        await Product.findByIdAndUpdate(product._id, { currentPrice });

        // Compare the current price with the tracked price
        if (currentPrice < product.currentPrice) {
          // If the current price is less than the tracked price, print a console notification
          printConsoleNotification(product.name, currentPrice, product.currentPrice);
        }
      }
    }

    console.log('Cron job completed');
  } catch (error) {
    console.error('Error during price tracking cron job:', error);
  }
});



async function searchECommerce(site, productTitle) {
  const browser = await puppeteer.launch({
    headless: true,
    timeout:60000,
  });
  const page = await browser.newPage();

  try {
    // Navigate to the specified e-commerce site
    const searchUrl = site === 'amazon' ?
      'https://www.amazon.com' :
      'https://www.flipkart.com';

      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Type the product title in the search box
    const searchBoxSelector = site === 'amazon' ? 'input[name="field-keywords"' : 'input[name="q"]';
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
            
            const image = imageElement ? imageElement.src : null;
    
            const currentPriceElement = container.querySelector('.a-price .a-offscreen');
            const price = currentPriceElement ? currentPriceElement.innerText.trim() : 'N/A';
            const site = 'amazon';
    
            products.push({
              title,
              price,
              image,
              productId,
              site
            });
    
            console.log(products);
          }
        }
      }else if (window.location.hostname.includes('flipkart')) {
        // Flipkart
        // Inside the Flipkart section of page.evaluate
        const productContainers = document.querySelectorAll('div._1AtVbE');

        for (const container of productContainers) {
            const titleElement = container.querySelector('a._1fQZEK');
            const titlElement = container.querySelector('div._4rR01T');
            const priceElement = container.querySelector('div._30jeq3');
            const productIdElement = container.querySelector('div._1AtVbE div[data-id]');
            const productId = productIdElement ? productIdElement.getAttribute('data-id') : null;
            const imageElement = container.querySelector('img');

            // Check if both titleElement and priceElement are not null
            if (titleElement && priceElement) {
                // Use optional chaining to handle potential null values
                const title = titlElement.textContent;
                const price = priceElement.innerText?.trim() || 'N/A';
                const image = imageElement?.src || null;
                const productId = container.getAttribute('data-id') || null;
                const site = 'flipkart';

                products.push({
                    title,
                    price,
                    image,
                    productId,
                    site
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
  const websites = ['flipkart','amazon'];

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
    const favorites = await Product.find().limit(10);;
    res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});