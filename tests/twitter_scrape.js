const cheerio = require('cheerio');

const twitterScrape = async (page, hashtag, scrapingData) => {
  // Go to the hashtag page
  console.log('Step: Go to the hashtag page');
  await page.goto(`https://twitter.com/search?q=${hashtag}&src=typed_query`);

  // Wait an additional 5 seconds until fully loaded before scraping
  await page.waitForTimeout(5000);

  // Scrape the tweets
  console.log('Step: Scrape the tweets');

  const html = await page.content();
  const $ = cheerio.load(html);

  $('div[data-testid="cellInnerDiv"]').each((i, el) => {
    const tweet_text = $(el).find('div[data-testid="tweetText"]').text();
    const tweet_user = $(el).find('a[tabindex="-1"]').text();
    const tweet_record = $(el).find('span[data-testid="app-text-transition-container"]');
    const commentCount = tweet_record.eq(0).text();
    const likeCount = tweet_record.eq(1).text();
    const shareCount = tweet_record.eq(2).text();
    const viewCount = tweet_record.eq(3).text();
    if (tweet_user && tweet_text) {
    scrapingData[i] = {
        user: tweet_user,
        content: tweet_text.replace(/\n/g, '<br>'),
        comment: commentCount,
        like: likeCount,
        share: shareCount,
        view: viewCount,
    };
}
  });
};

module.exports = {
  twitterScrape,
};
