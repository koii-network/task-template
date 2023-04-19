// TODO - produce map of arweave
// Import required modules
require('dotenv').config();
const axios = require('axios');
const Data = require(__dirname + '/../../model/data.js');
const Adapter = require(__dirname + '/../../model/adapter.js');
const {Builder, Browser, By, Key, until} = require('selenium-webdriver');


class Arweave extends Adapter {
  constructor(credentials, maxRetry, db, txId) {
      super(credentials, maxRetry, txId);
      this.credentials = credentials || {};
      this.maxRetry = maxRetry || 3;
      this.txId = txId;
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

  parseNode = async (node) => {
    
    let peers = await this.getPeers (node)

    let txCheck = await this.checkTx (this.txId)

    // TODO - add db updates here
    // 1. Remove from pending
    // 2. update db to reflect node status?

    return this
  }

  getPeers = async (node) => {
    let peers = [];
    try {
      // console.log('sending PEER check for ', this.location)
      const payload = await superagent.get(`${node}/peers`).timeout({
          response: superagentdelays.peers.response,  
          deadline: superagentdelays.peers.deadline, 
        })
      // console.log('payload returned from ' + this.location, payload)
      const body = JSON.parse(payload.text);
      // console.log("BODY", body)
      if (body) {
        peers = body;
      } 
      return

    } catch (err) {
        console.error ("can't fetch peers from " + this.location, err)
    }
    return peers;
  }
  checkTx = async function ( node, txId ) {
    let containsTx = false;
      try {
          // console.log('sending txid check for ', peerUrl)
          const payload = await superagent.get(`${node}/${ txId }`).timeout({
              response: superagentdelays.txfetch.response,  
              deadline: superagentdelays.txfetch.deadline, 
            })
          // console.log('payload returned from ' + peerUrl, payload)
          const body = JSON.parse(payload.text);
          containsTx = true;

        } catch (err) {
          // if (debug) console.error ("can't fetch " + this.location, err)
        }
    return containsTx;
  }

  negotiateSession = async () => {
    return true; // only leaving this here so it doesn't throw errors in gatherers
  }

  getNextPendingItem = async () => {
    return this.db.getPending(1);
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
      // the main difference with this adapter is that the node's IP address is the data for each item, so the ID === VALUE 
      if (!this.db.isPendingItem(node) && !this.db.isDataItem(node)) {
        this.db.addPendingItem(node, node)
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
