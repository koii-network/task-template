const { twitterLogin } = require('./twitter_login');
const { twitterScrape } = require('./twitter_scrape');
const puppeteer = require('puppeteer');
const fs = require('fs');
const Data = require('../model/data');
const levelup = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown(__dirname + '/twitter-db'));

const Item = require('./test_item');

// setup tag to scrape
const hashtag = '%23Web3';

async function main() {

  // run scrape
  const scrapingData = await runScrape();

  // setup data format
  let twitterData = [];
  for (const [key, value] of Object.entries(scrapingData)) {
    const item = new Item({ id: key, name: JSON.stringify(value), description: hashtag});
    twitterData.push(item);
  }
  console.log('twitterData: ', twitterData);

  // setup db
  const data = new Data('twitter', db, twitterData);

  // set tiwtter list to item list
  await data.createItems(twitterData);

  // Test getting a list of items
  // data
  //   .getList()
  //   .then(list => {
  //     console.log('Get list ', list);
  //   })
  //   .catch(err => {
  //     console.error('Get list test failed:', err);
  //   });
}

async function runScrape() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Enable console logs in the context of the page
  page.on('console', consoleObj => console.log(consoleObj.text()));

  // Set the viewport to a reasonable size
  // * height influences the amount of tweets loaded
  // !! 50 tweets are loaded per viewport
  // TODO nextPage() or scrollPage() funciton to load more tweets
  await page.setViewport({ width: 1920, height: 10000 });

  // Login to twitter
  await twitterLogin(page);

  // Wait an additional 5 seconds until fully log in
  await page.waitForTimeout(5000);

  let scrapingData = {};

  // Scrape the tweets
  await twitterScrape(page, hashtag, scrapingData);


  // Save data to the file named twitter_scraping_data.json
  fs.writeFile(
    'twitter_scraping_data.json',
    JSON.stringify(scrapingData, null, 2),
    err =>
      err
        ? console.log('Data not written!', err)
        : console.log('Data written!'),
  );

  return scrapingData;
}

main();
