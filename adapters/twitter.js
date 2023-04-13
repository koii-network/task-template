// Import required modules
require('dotenv').config();
const axios = require('axios');
const Data = require(__dirname + '/model/data.js');
const Adapter = require(__dirname + '/../model/adapter.js');

module.exports = new Adapter({
    "credentials": {
        "key": process.env.TWITTER_API_KEY,
    },
    "maxRetry": 3,
    "shims": {
        "newSearch" : async (query) => {
            return getRecentTweets(query)
        },
        "parseOne" : async (search) => {
            // TODO fetch an item from the correct dataDb (pending:) and then parse it and add the results under (data:)
        },
        "checkSession" : async () => {
            // TODO check if the session is valid
        }
    },
    "data": []
});

// Function to get recent tweets about a keyword
async function getRecentTweets(keyword) {
  try {
    const twitterApiUrl = 'https://api.twitter.com/2/tweets/search/recent';
    const queryParams = new URLSearchParams({
      query: keyword,
      'tweet.fields': 'created_at,public_metrics',
      max_results: 10,
    });

    const response = await axios.get(`${twitterApiUrl}?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error('No tweets found.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching tweets:', error.message);
    return [];
  }
}

// Example usage: Get recent tweets about the keyword "javascript"
getRecentTweets('javascript').then((tweets) => {
  console.log('Recent tweets about "javascript":');
  tweets.forEach((tweet) => {
    console.log(`[${tweet.created_at}] ${tweet.text}`);
  });
});