const { twitterLogin } = require('./twitter_login');
const { twitterScrape } = require('./twitter_scrape');
const puppeteer = require('puppeteer');
const fs = require('fs');

const hashtag = '%23Web3';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Enable console logs in the context of the page
  page.on('console', consoleObj => console.log(consoleObj.text()));

  // Set the viewport to a reasonable size
  // * height influences the amount of tweets loaded
  await page.setViewport({ width: 1920, height: 3000 });

  // Login to twitter
  await twitterLogin(page);

  // Wait an additional 5 seconds until fully log in
  await page.waitForTimeout(5000);

  let scrapingData = {};

  // Scrape the tweets
  await twitterScrape(page, hashtag, scrapingData);

  console.log('Twitter scraping Data: ', scrapingData);

  // Save data to the file named twitter_scraping_data.json
    fs.writeFile(
        'twitter_scraping_data.json',
        JSON.stringify(scrapingData, null, 2),
        (err) => err ? console.log('Data not written!', err) : console.log('Data written!'),
    );

  // TODO： Save the data to the levelDB

})();
