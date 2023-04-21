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
        let allLinktrees = await db.getAllLinktrees();
        allLinktrees = allLinktrees || '[]';

        // for each node, get all linktrees
        for (let url of nodeUrlList) {
          console.log(url);
          const res = await axios.get(`${url}/task/${TASK_ID}/linktree/all`);
          if (res.status != 200) {
            console.error('ERROR', res.status);
            continue;
          }
          const payload = res.data;

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
                await db.setLinktree(value.publicKey, value.data)
              }
            } else {
              await db.setLinktree(value.publicKey, value.data)
            }
          }
        }
      } catch (error) {
        console.error('Some went wrong:', error);
      }
    }

module.exports = { share }