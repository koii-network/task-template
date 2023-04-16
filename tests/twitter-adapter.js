const Gatherer = require('../model/gatherer');
const levelup = require('levelup');
const leveldown = require('leveldown');
const db = levelup(leveldown(__dirname + '/localKOIIDB'));

const credentials = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
};

const run = async () => { 
    const adapter = new twitter(credentials, 3);

    let query = "web3"; // the query our twitter search will use

    const gatherer = new Gatherer(db, adapter, 3, query);

    // run a gatherer to get 100 items
    let results = await gatherer.gather(100);

    // TODO - add a test to check that the db has been populated with the correct data
    gatherer.getList().then((list) => {
        console.log(list);
    })

}