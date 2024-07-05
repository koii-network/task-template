const puppeteer = require('puppeteer');
// const { addSubmission } = require('./supabase');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { KoiiStorageClient } = require('@_koii/storage-task-sdk');

(async () => {
  try {
    console.log("Mars was here *************** ")

    // Launch a new browser instance
    const browser = await puppeteer.launch({ headless: false }); // Set headless: false for debugging

    // Open a new page
    const page = await browser.newPage();

    // Set user agent (optional)
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    );

    // Navigate to the desired URL
    const url = 'https://www.theguardian.com/uk'; // Replace with your target URL
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); // 60 seconds timeout

    // Scroll down until the container with id "most-viewed-in-uk-news" is visible
    const containerId = '#most-viewed-in-uk-news';
    await page.evaluate(async (containerId) => {
      while (!document.querySelector(containerId)) {
        window.scrollBy(0, window.innerHeight);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      document.querySelector(containerId).scrollIntoView();
    }, containerId);

    // Wait for the container to be fully loaded
    await page.waitForSelector(containerId, { timeout: 60000 }); // 60 seconds timeout

    // Find the <ol> elements and list the items within them, removing "live" if it starts with it
    const lists = await page.evaluate((containerId) => {
      const container = document.querySelector(containerId);
      if (!container) return null;

      const olElements = container.querySelectorAll('ol');
      if (olElements.length !== 2) return 'Other number than exactly two <ol> elements found';

      return Array.from(olElements).map(ol => 
        Array.from(ol.querySelectorAll('li')).map(li => {
          let text = li.textContent.trim();
          if (text.toLowerCase().startsWith('live')) {
            text = text.slice(4).trim(); // Remove "live" and trim any leading whitespace
          }

          const linkElement = li.querySelector('a');
          const link = linkElement ? linkElement.href : null;

          return { text, link };
        })
      );
    }, containerId);



    // The DOM extraction code is a little bit tricky. Could have returned it in a better format, easier to reformat after the fact
    let mostViewedTitle = [];
    let mostViewedLink  = [];
    let mostReadTitle   = [];
    let mostReadLink    = [];
    for (let i=0; i<10; i++) { // On Guardian website there are always exactly 10 links
      mostViewedTitle.push(lists[0][i].text);
      mostViewedLink .push(lists[0][i].link);
      mostReadTitle  .push(lists[1][i].text);
      mostReadLink   .push(lists[1][i].link);
    }

    console.log(mostViewedTitle, mostViewedLink, mostReadTitle, mostViewedLink);

    let signed = await namespaceWrapper.payloadSigning(JSON.stringify(mostViewedTitle) + JSON.stringify(mostViewedLink) + JSON.stringify(mostReadTitle) + JSON.stringify(mostReadLink));

    let publicKey = (await namespaceWrapper.getSubmitterAccount()).publicKey;

    console.log("public key: " + publicKey);
    console.log(publicKey, 2, mostViewedTitle, mostViewedLink, mostReadTitle, mostReadLink, signed);

    // await addSubmission(publicKey, 2, mostViewedTitle, mostViewedLink, mostReadTitle, mostReadLink, signed);

    await browser.close();
    
    // process.exit(); // Mars: for some reason it wasn't closing properly otherwise
                       // No longer using to not mess with the framework 
  } catch (error) {
    console.error('Error:', error);
  }
})();
