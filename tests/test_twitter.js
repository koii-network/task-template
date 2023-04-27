const { twitterLogin } = require('./twitter_login');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const hashtag = '%23Web3';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.on('console', consoleObj => console.log(consoleObj.text()));
  await page.setViewport({ width: 1280, height: 800 });

  await twitterLogin(page);

  // Wait an additional 5 seconds until fully log in
  await page.waitForTimeout(5000);

  // Go to the hashtag page
  console.log('Step: Go to the hashtag page');
  await page.goto(`https://twitter.com/search?q=${hashtag}&src=typed_query`);

  // Wait an additional 5 seconds until fully loaded before scraping
  await page.waitForTimeout(5000);

  // Scrape the tweets
  console.log('Step: Scrape the tweets');

  const html = await page.content();
  const $ = cheerio.load(html);

  $('div[data-testid="tweet"]').each((i, el) => {
    const tweet = $(el).find('div[lang]').text();
    console.log(tweet);
  });
})();
