// TODO - produce map of arweave
// Import required modules
require('dotenv').config();
const axios = require('axios');
const Data = require(__dirname + '/../../model/data.js');
const Adapter = require(__dirname + '/../../model/adapter.js');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');


class Arweave extends Adapter {
  constructor(credentials, maxRetry) {
      super(credentials, maxRetry);
      this.credentials = credentials || {};
      this.maxRetry = maxRetry || 3;
      this.shims = {
            "parseOne" : async (node) => {
                // TODO - fetch one arweave node from the pending list, and see if it is online
                let healthCheck = await this.checkNode(node)

                // if it is online, then parse it and add it's peers to the pending list
                if (healthCheck) {
                    this.parseNode(node)
                }
            },
            "checkNode" : async () => {
                // TODO check if the session is valid
            }
        }
      // this.data = new Data('tweets', []);
  }

  negotiateSession = async () => {
    return true; // only leaving this here so it doesn't throw errors in gatherers
  }

  checkNode = async () => {
    // TODO - need a clean way  to reintroduce this, for now it's wasting API credits
    this.session.isValid = true
    return true;
  }

  newSearch = async (query) => {
    console.log('fetching peer list');
    let newNodes = [];

    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
  
    try {
      await driver.get("https://arweave.net" + '/peers');
      let l = await driver.findElement(By.tagName("body"));
      let text = (await l.getText()).toString();
      let items = text.replace(/['"\[\]\n]+/g, '')
      newNodes = items.split(',');
      
    } finally {
      await driver.quit();
    }
  
    return newNodes;
  }
}

module.exports = Arweave;
