const express = require('express');
const router = express.Router();
const db = require('./db_model');
const fs = require('fs');
const { namespaceWrapper } = require('./namespaceWrapper');

// Middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});



    router.get('/taskState', async (req, res) => {
        const state = await namespaceWrapper.getTaskState();
        console.log("TASK STATE", state);

        res.status(200).json({ taskState: state })
    })

    // API to register the linktree
    router.post('/linktree', async (req, res) => {
    const linktree = req.body.payload;
    // Check req.body
    if (!linktree) {
        res.status(400).json({ error: 'Invalid request' });
        return;
    } else {
        console.log(linktree);
    }

    // Use the code below to sign the data payload
    let signature = linktree.signature;
    let pubkey = linktree.publicKey

    let proof = {
        publicKey: pubkey,
        signature: signature,
    }
    console.log('Check Proof:', proof);
    // use fs to write the linktree and proof to a file
    if (!fs.existsSync('/Linktree')) fs.mkdirSync('/Linktree');
    fs.writeFileSync("/Linktree/" + `linktree_${pubkey}.json`, JSON.stringify(linktree));
    // fs.writeFileSync('proof.json', JSON.stringify(proof));
    await db.setLinktree(pubkey, linktree);

    const round = await namespaceWrapper.getRound();
    // TEST For only testing purposes:
    // const round = 1000

    let proofs = await db.getProofs(pubkey);
    proofs = JSON.parse(proofs || '[]');
    proofs.push(proof);
    console.log(`${pubkey} Proofs: `, proofs);
    await db.setProofs(pubkey, proofs);

    return res.status(200).send({message: 'Proof and linktree registered successfully'});
    });
    router.get("/logs", async (req, res) => {
    const logs = fs.readFileSync("./namespace/logs.txt", "utf8")
    res.status(200).send(logs);
    })
    // endpoint for specific linktree data by publicKey
    router.get('/linktree/get', async (req, res) => {
    const log = "Nothing to see here, check /:publicKey to get the linktree"
    return res.status(200).send(log);
    });
    router.get('/linktree/get/:publicKey', async (req, res) => {
    const { publicKey } = req.params;
    let linktree = await db.getLinktree(publicKey);
    linktree = linktree || '[]';
    return res.status(200).send(linktree);
    });
    router.get('/linktree/all', async (req, res) => {
    linktree = await db.getAllLinktree() || '[]';
        return res.status(200).send(linktree);
        }

    );

    router.get('/linktree/list', async (req, res) => {
        linktree = await db.getAllLinktree(true) || '[]';
        return res.status(200).send(linktree);
        }
    );
    router.get('/proofs/all', async (req, res) => {
    linktree = await db.getAllProofs() || '[]';
    return res.status(200).send(linktree);
    }
    );
    router.get('/proofs/get/:publicKey', async (req, res) => {
    const { publicKey } = req.params;
    let proof = await db.getProofs(publicKey);
    proof = proof || '[]';
    return res.status(200).send(proof);
    }
    );
    router.get('/node-proof/all', async (req, res) => {
    linktree = await db.getAllNodeProofCids() || '[]';
    return res.status(200).send(linktree);
    });
    router.get('/node-proof/:round', async (req, res) => {
        const { round } = req.params;
        let nodeproof = await db.getNodeProofCid(round) || '[]';
        return res.status(200).send(nodeproof);
        });
    router.get('/authlist/get/:publicKey', async (req, res) => {
    const { publicKey } = req.params;
    let authlist = await db.getAuthList(publicKey);
    authlist = authlist || '[]';
    return res.status(200).send(authlist);
    });
    router.get('/authlist/list', async (req, res) => {
        authlist = await db.getAllAuthLists(false) || '[]';
        authlist.forEach((authuser) => {
            authuser = authuser.toString().split("auth_list:")[0] 
        });
        return res.status(200).send(authlist);
    });
  // router.post('/register-authlist', async (req, res) => {
  //   const pubkey = req.body.pubkey;
  //   await db.setAuthList(pubkey);
  //   return res.status(200).send({message: 'Authlist registered successfully'});
  // }
  // )

module.exports = router;