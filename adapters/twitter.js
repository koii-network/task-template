// Import required modules
require('dotenv').config();
const axios = require('axios');
const Data = require(__dirname + '/../model/data.js');
const Adapter = require(__dirname + '/../model/adapter.js');
const { TwitterApi } = require('twitter-api-v2')

class Twitter extends Adapter {
  constructor(credentials, maxRetry) {
      super(credentials, maxRetry);
      this.credentials = credentials;
      if ( !this.credentials.accessToken || !this.credentials.accessTokenSecret ) {
        throw new Error('Twitter API credentials are missing');
      }
      this.maxRetry = maxRetry;
      this.shims = {
            "parseOne" : async (search) => {
                // TODO fetch an item from the correct dataDb (pending:) and then parse it and add the results under (data:)
                return parseOneTweet(id);
            },
            "checkSession" : async () => {
                // TODO check if the session is valid
            }
        }
      // this.data = new Data('tweets', []);
  }

  negotiateSession = async () => {
    console.log('received keys', this.credentials)
    const client = new TwitterApi({
      // appKey: this.credentials.apiKey,
      // appSecret: this.credentials.apiSecretKey,
      accessToken: this.credentials.accessToken,
      accessSecret: this.credentials.accessTokenSecret,
    });  
    this.session = client;
    return await this.checkSession();
  }

  checkSession = async () => {
    try {
      const userDetails = await this.session.v1.get('account/verify_credentials.json');
      console.log('User details:', userDetails);
      console.log('Twitter session is valid.');
      this.session.isValid = true; 
      return userDetails;
    } catch (error) {
      console.error('Error verifying Twitter session:', error);
      this.session.isValid = false;
      return error
    }  
  }

  newSearch = async (query) => {
    try {
      const queryParams = new URLSearchParams({
        query: keyword,
        'tweet.fields': 'created_at,public_metrics',
        max_results: 10,
      });

      const result = await client.v2.get('tweets/search/recent', { query: 'nodeJS', max_results: 100 });
      console.log(result.data); // TweetV2[]
      // if (result.data) {

      // } else {
      //   console.error('No tweets found.');
      //   return [];
      // }
    } catch (error) {
      console.error('Error fetching tweets:', error.message);
      return [];
    }
  }
}


const parseTweet = async (tweet) => {
    console.log('new tweet!', tweet)
    let item = {
        id: tweet.id,
        data: tweet,
        list: getIdListFromTweet(tweet)
    }

    return item;
}

const getIdListFromTweet = (tweet) => {
    // parse the tweet for IDs from comments and replies and return an array
    
    return [];
}



module.exports = Twitter;