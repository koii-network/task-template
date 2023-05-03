// Usage example
const puppeteer = require('puppeteer');
const autoScroll = require('./autoscroll.js');

(async () => {
    // Launch the browser and open a new page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
  
    // Navigate to the desired website
    await page.goto('https://koii.network');
  
    // Set the viewport height to simulate a specific screen size
    await page.setViewport({ width: 1280, height: 800 });
  
    // Scroll every second by 100 pixels
    //await scrollIndefinitely(page, 1);
    await autoScroll(page);
  
    // Perform any other tasks or take a screenshot after waiting for some time
    // For example, waiting for 10 seconds before taking a screenshot
    await page.waitForTimeout(10 * 1000);
  
    // Close the browser
    await browser.close();
})();