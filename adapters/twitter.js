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
      
      // don't need shims, duh
      // this.shims = {
      //       "parseOne" : async (search) => {
      //           // TODO fetch an item from the correct dataDb (pending:) and then parse it and add the results under (data:)
      //           return parseOneTweet(id);
      //       },
      //       "checkSession" : async () => {
      //           // TODO check if the session is valid
      //       }
      //   }
      // this.data = new Data('tweets', []);
  }

  negotiateSession = async () => {
    console.log('received keys', this.credentials)
    try {
      const client = new TwitterApi({
        // appKey: this.credentials.apiKey,
        // appSecret: this.credentials.apiSecretKey,
        accessToken: this.credentials.accessToken,
        accessSecret: this.credentials.accessTokenSecret,
      });  
      this.session = client;
      return await this.checkSession();
    } catch (error) {
      console.error('Error verifying Twitter session:', error);
      this.session.isValid = false;
      return error  
    }
  }

  checkSession = async () => {
    // TODO - need a clean way  to reintroduce this, for now it's wasting API credits
    this.session.isValid = true
    return true;
    // try {
    //   const userDetails = await this.session.v1.get('account/verify_credentials.json');
    //   console.log('User details:', userDetails);
    //   console.log('Twitter session is valid.');
    //   this.session.isValid = true; 
    //   return userDetails;
    // } catch (error) {
    //   console.error('Error checking Twitter session:', error);
    //   this.session.isValid = false;
    //   return error
    // }  
  }

  newSearch = async (query) => {
    try {
      const result = await this.session.v2.get('tweets/search/recent', { query: query, max_results: 100, expansions: 'author_id', 'tweet.fields': 'created_at,author_id,public_metrics', 'user.fields': 'username' });
      console.log(result.data); 
      return result.data;
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