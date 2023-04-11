const { PublicKey } = require("@_koi/web3.js");
const { namespaceWrapper } = require("../namespaceWrapper");

async function getLocalLevelDB() {
  let linktree_string;
  // await namespaceWrapper.storeSet("linktrees", []);
   const PublicKey = 'Aw7taUvkq8dzK3gXWygB78b3UkA2XypB1rKEX256tBCG'
   const round = 1000
    linktree_string = await namespaceWrapper.storeGet(`linktree:${PublicKey}`);
    console.log("Linktree string", linktree_string);

    Proof_list_string = await namespaceWrapper.storeGet(`proofs:${round}`);
    console.log("Proofs list string", Proof_list_string);

    Node_Proof_cid = await namespaceWrapper.storeGet(`node_proofs:${round}`);
    console.log("Node list string", Node_Proof_cid);
}

getLocalLevelDB();