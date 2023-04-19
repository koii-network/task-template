const { app, MAIN_ACCOUNT_PUBKEY, SERVICE_URL, TASK_ID } = require("./init");
const {default: axios} = require('axios');
const db = require('./db_model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');


const share = async () => {
      try {
        // find another node
        const nodesUrl = `${SERVICE_URL}/nodes/${TASK_ID}`;

        // check if the node is online
        const res = await axios.get(nodesUrl);
        if (res.status != 200) {
          console.error('Error', res.status);
          return;
        }
  
        if (!res.data) {
          console.error('res has no valid urls');
          return;
        }

        let nodeUrlList = res.data.map((e) => {
          return e.data.url;
        });
        
        console.log(nodeUrlList);
        
        // fetch local linktrees
        let allLinktrees = await db.getAllLinktrees(); // TODO
        allLinktrees = allLinktrees || '[]';

        // for each node, get all linktrees? 
        // TODO - get only one linktree per node, and compare them 
        // it will be cleaner to focus on one pubkey, and compare with many nodes (maybe 3 nodes)
        for (let url of nodeUrlList) {
          console.log(url);
          const res = await axios.get(`${url}/task/${TASK_ID}/linktree/all`);
          if (res.status != 200) {
            console.error('ERROR', res.status);
            continue;
          }
          const payload = res.data;


          // TODO - there are several things to compare
          /* 
            1. the list of all linktrees held by each node (the list of public keys)
            2. the linktree data for each public key
            3. the timestamp of each linktree item on each node (we should only download newer data)
          */

          /*
        1. Verify the signature
        2. Only update your db if incoming timestamp > your timestamp or you don't have the data
        */
       // TODO - fix by adding linktree comparisons for each publickey - the list shared between nodes should be the public keys of all known linktrees

       // TODO2 - whenever a linktree is not found on this node, it should be added to the db
       
       // TODO3 - whenever a linktree is found on this node, it should be compared to the one in the db and updated if the timestamp is newer
       
       if (!payload || payload.length == 0) continue;
       for (let i = 0; i < payload.length; i++) {
         const value = payload[i].value;
         const isVerified = nacl.sign.detached.verify(
           new TextEncoder().encode(JSON.stringify(value.data)),
           bs58.decode(value.signature),
           bs58.decode(value.publicKey)
         );
            if (!isVerified) {
              console.warn(`${url} is not able to verify the signature`);
              continue;
            }
            let localExistingLinktree = allLinktrees.find((e) => {
              e.uuid == value.data.uuid;
            });
            if (localExistingLinktree) {
              if (localExistingLinktree.data.timestamp < value.data.timestamp) {
                allLinktrees.push(value);
              }
            } else {
              allLinktrees.push(value);
            }
          }
        }
      } catch (error) {
        console.error('Some went wrong:', error);
      }
    }

module.exports = { share }