const dbmodel = require('../db_model');

const PublicKey = "test-pubkey1"

async function testdb() {
const round = 1000;
const pubkey = PublicKey;

    // get linktree
    // let linktree = await dbmodel.getLinktree(PublicKey);
    // console.log(linktree);

    // get all linktrees
    // await dbmodel.getAllLinktrees();

    // set linktree
    let linktree2 = {
        "name": "test1",
        "description": "test1",
        "avatar": "test1",
        "links": [
            {
                "name": "test1",
                "url": "test1"
            }
        ]
    }
    await dbmodel.setLinktree(PublicKey, linktree2);

    // set node proofs
    // let cid = "testcid"
    // await dbmodel.setNodeProofCid(round, cid);  

    // get node proofs
    // let nodeProofs = await dbmodel.getNodeProofCid(round);
    // console.log(nodeProofs);

    // set proofs
    // let proofs = {
    //   publicKey: "test-pubkey1",
    //   signature: "test-signature1",
    // }
    // await dbmodel.setProofs(pubkey, proofs);

    // get proofs
    // let proofs = await dbmodel.getProofs(round);
    // console.log(proofs);

    // get all proofs
    // await dbmodel.getAllProofs();

}                  

testdb()