// TODO - produce map of arweave
// Import required modules
require('dotenv').config();
const axios = require('axios');
const Data = require(__dirname + '/../../model/data.js');
const Adapter = require(__dirname + '/../../model/adapter.js');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');


class Arweave extends Adapter {
  constructor(credentials, maxRetry, db) {
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
      this.db = db;
  }

  getNextPage = async (query) => {
    // there is only 1000 results per page in this model, so we don't need to have a second page
    return null;
  }

  negotiateSession = async () => {
    return true; // only leaving this here so it doesn't throw errors in gatherers
  }

  checkNode = async () => {
    // TODO - need a clean way  to reintroduce this, for now it's wasting API credits
    this.session.isValid = true
    return true;
  }

  getPendingItems() {
    return this.db.getPendingItems();
  }

  storeListAsPendingItems(list) {
    console.log('db', this.db)
    // TODO - store the list of nodes as pending items using db
    for (let node of list) {
      if (!this.db.isPendingItem(node) && !this.db.isDataItem(node)) {
        this.db.addPendingItem(node)
      } 
    }
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
