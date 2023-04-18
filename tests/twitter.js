const dotenv = require('dotenv');
const { TwitterApi } = require('twitter-api-v2');

const run  = async () => {
    const client = new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: process.env.TWITTER_BEARER_TOKEN,
        accessSecret: process.env.TWITTER_BEARER_TOKEN_SECRET,
      });

      // TODO - move below into /adapter/twitter.js

    // With default prefix
    const result = await client.v2.get('tweets/search/recent', { query: 'nodeJS', max_results: 100 });
    console.log(result.data); // TweetV2[]

    // With custom prefix
    const mediaStatus = await client.v1.get<MediaStatusV1Result>(
        'media/upload.json',
        { command: 'STATUS', media_id: '20' },
        { prefix: 'https://upload.twitter.com/1.1/' }
    );
    console.log('Media is ready:', mediaStatus.processing_info.state === 'succeeded');
}

run ()