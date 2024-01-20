const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3001;

async function scrapeProductDetails(url, titleSelector, priceSelector, imageSelector) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto(url);

    const productDetails = await page.evaluate((titleSelector, priceSelector, imageSelector) => {
        const titleElement = document.querySelector(titleSelector);
        const priceElement = document.querySelector(priceSelector);
        const imageElement = document.querySelector(imageSelector);

        const title = titleElement ? titleElement.innerText.trim() : null;
        const price = priceElement ? priceElement.innerText.trim() : null;
        const image = imageElement ? imageElement.src : null;

        return {
            title,
            price,
            image
        };
    }, titleSelector, priceSelector, imageSelector);

    await browser.close();
    return productDetails;
}

app.get('/scrape/:platform/:productId', async (req, res) => {
    const { platform, productId } = req.params;

    if (platform === '1') {
        const amazonUrl = `https://www.amazon.com/dp/${productId}/`;
        const amazonProductDetails = await scrapeProductDetails(amazonUrl, '#productTitle', '#price_inside_buybox', '#landingImage');
        res.json({ platform: 'Amazon', productDetails: amazonProductDetails });
    } else if (platform === '2') {
        const flipkartUrl = `https://www.flipkart.com/${productId}?pid=${productId}`;
        const flipkartProductDetails = await scrapeProductDetails(flipkartUrl, '.B_NuCI', '._30jeq3', '._396cs4');
        res.json({ platform: 'Flipkart', productDetails: flipkartProductDetails });
    } else {
        res.status(400).json({ error: 'Invalid platform' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
