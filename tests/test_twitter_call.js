const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const username = 'soma@koii.network';
const username_check = 'Soma41717079';
const password = '970128ldydq';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.on('console', consoleObj => console.log(consoleObj.text()));
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Step: Reach twitter login page');

  await page.goto('https://twitter.com/i/flow/login');
  // Wait an additional 5 seconds before scraping
  await page.waitForTimeout(5000);

  console.log('Step: Fill in username');

  await page.waitForSelector('input[autocomplete="username"]');
  await page.type('input[autocomplete="username"]', username);
  await page.keyboard.press('Enter');

  const twitter_verify = await page
    .waitForSelector('input[data-testid="ocfEnterTextTextInput"]', {
      timeout: 5000,
      visible: true,
    })
    .then(() => true)
    .catch(() => false);

  if (twitter_verify) {
    await page.type(
      'input[data-testid="ocfEnterTextTextInput"]',
      username_check,
    );
    await page.keyboard.press('Enter');
  }

  console.log('Step: Fill in password');

  await page.waitForSelector('input[name="password"]');
  await page.type('input[name="password"]', password);
  await page.keyboard.press('Enter');

  console.log('Step: Click login button');

  page.waitForNavigation({ waitUntil: 'load' });

  console.log('Step: Login successful');

  // Wait an additional 5 seconds until fully log in
  await page.waitForTimeout(5000);
  await page.goto('https://twitter.com/search?q=%23Web3&src=typed_query');

  // Wait an additional 5 seconds until fully loaded before scraping
  await page.waitForTimeout(5000);
  const html = await page.content();
  const $ = cheerio.load(html);

  $('div[data-testid="tweet"]').each((i, el) => {
    const tweet = $(el).find('div[lang]').text();
    console.log(tweet);
  });
})();
