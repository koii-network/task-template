require('dotenv').config();

const username = process.env.TWITTER_USER_NAME;
const username_id = process.env.TWITTER_USER_ID;
const password = process.env.TWITTER_PASSWORD;


const twitterLogin = async (page) => {
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
      username_id,
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
};

module.exports = {
  twitterLogin,
};
