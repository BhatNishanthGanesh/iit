const express = require('express');
const puppeteer = require('puppeteer');


const app = express();
const port = 3100;


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

        await page.goto(searchUrl);

        // Type the product title in the search box
        const searchBoxSelector = site === 'amazon' ? '#twotabsearchtextbox' : 'input[name="q"]';
        await page.type(searchBoxSelector, productTitle);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

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

// Example usage
const searchTerm = 'laptop';
// searchECommerce('amazon', searchTerm)
//     .then(products => {
//         console.log(`Amazon search results for "${searchTerm}":`, products);
//     })
//     .catch(error => {
//         console.error('Error during Amazon search:', error);
//     });

// searchECommerce('flipkart', searchTerm)
//     .then(products => {
//         console.log(`Flipkart search results for "${searchTerm}":`, products);
//     })
//     .catch(error => {
//         console.error('Error during Flipkart search:', error);
//     });

app.get('/', async (req, res) => {
    console.log('hello')
    const  title  = 'laptop'
    const websites = ['amazon', 'flipkart']
    console.log("jjj")
    try {
        const results = await Promise.all(websites.map(site => searchECommerce(site, title)));
        res.json(results);
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({
            error: 'Failed to perform the search'
        });
    }
})

app.listen(port, () => {
    console.log(`Express app listening at http://localhost:${port}`);
});

