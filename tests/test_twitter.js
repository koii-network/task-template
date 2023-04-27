const { twitterLogin } = require('./twitter_login');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const hashtag = '%23Web3';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.on('console', consoleObj => console.log(consoleObj.text()));
  await page.setViewport({ width: 1920, height: 2000 });

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

  let scrapingData = [];

  $('div[data-testid="cellInnerDiv"]').each((i, el) => {
    console.log(i)
    const tweet_text = $(el).find('div[data-testid="tweetText"]').text();
    const tweet_user = $(el).find('a[tabindex="-1"]').text();
    const tweet_record = $(el).find('span[data-testid="app-text-transition-container"]');
    const commentCount = tweet_record.eq(0).text();
    const likeCount = tweet_record.eq(1).text();
    const shareCount = tweet_record.eq(2).text();
    const viewCount = tweet_record.eq(3).text();
    console.log(tweet_user, "post ", tweet_text, " has record: comments:", commentCount, " likes: ", likeCount, " shares: ", shareCount, " views: ", viewCount);
  });
  
})();
