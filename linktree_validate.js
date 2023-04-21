const dataFromCid = require("./helpers/dataFromCid");
const db = require('./db_model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const {default: axios} = require('axios');
const { namespaceWrapper } = require("./namespaceWrapper");

module.exports = async (submission_value, round) => {
  console.log('******/ Linktree CID VALIDATION Task FUNCTION /******');
  const outputraw = await dataFromCid(submission_value);
  const output = outputraw.data;
  console.log('OUTPUT', output);
  console.log('RESPONSE DATA length', output.proofs[0].LENGTH);
  console.log('PUBLIC KEY', output.node_publicKey);
  console.log('SIGNATURE', output.node_signature);

  // Check that the node who submitted the proofs is a valid staked node
  let isNode = await verifyNode(output.proofs, output.node_signature, output.node_publicKey);
  console.log("Is the node's signature on the CID payload correct?", isNode);

  // check each item in the linktrees list and verify that the node is holding that payload, and the signature matches
  let isLinktree = await verifyLinktrees(output.proofs);
  console.log('IS LINKTREE True?', isLinktree);

  if (isNode && isLinktree) return true; // if both are true, return true
  else return false; // if one of them is false, return false
}

// verify the linktree signature by querying the other node to get it's copy of the linktree
async function verifyLinktrees(proofs_list_object) {
  let allSignaturesValid = true;
  let AuthUserList = await db.getAllAuthLists();
  console.log('Authenticated Users List:', AuthUserList);
  
  for (const proofs of proofs_list_object) {

    let publicKey = proofs.value[0].publicKey

    // call other nodes to get the node list
    const nodeUrlList = await namespaceWrapper.getNodes();

    // TEST hardcode the node list
    // const nodeUrlList = [
    //   "http://localhost:10000",
    // ]

    // verify the signature of the linktree for each nodes
    for (const nodeUrl of nodeUrlList) {
      console.log("cheking linktree on ", nodeUrl)

      // get all linktree in this node
      const res = await axios.get(`${url}/task/${TASK_ID}/linktree/get/${publicKey}`);

      // TEST hardcode the node endpoint
      // const res = await axios.get(`${nodeUrl}/linktree/get/${publicKey}`);

      // check node's status
      if (res.status != 200) {
        console.error('ERROR', res.status);
        continue;
      }

      // get the payload
      const linktree = res.data;

      // check if the user's pubkey is on the authlist
      if (AuthUserList.hasOwnProperty(linktree.publicKey) ) {

        console.log('User is on the auth list');
        
      } else {

        // Verify the signature
        const messageUint8Array = new Uint8Array(
          Buffer.from(JSON.stringify(linktree.data)),
        );
        const signature = linktree.signature;
        const publicKey = linktree.publicKey;
        const signatureUint8Array = bs58.decode(signature);
        const publicKeyUint8Array = bs58.decode(publicKey);
        const isSignatureValid = await verifySignature(
          messageUint8Array,
          signatureUint8Array,
          publicKeyUint8Array,
        );
        console.log(`IS SIGNATURE ${publicKey} VALID?`, isSignatureValid);

        if (isSignatureValid) {
          await db.setAuthList(publicKey)
        } else {
          allSignaturesValid = false;
        }

      }     
      }
    }
  return allSignaturesValid;
}

// verifies that a node's signature is valid, and rejects situations where CIDs from IPFS return no data or are not JSON
async function verifyNode(proofs_list_object, signature, publicKey) {    
  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(proofs_list_object)),
  );
  const signatureUint8Array = bs58.decode(signature);
  const publicKeyUint8Array = bs58.decode(publicKey);

  if (!proofs_list_object || !signature || !publicKey) {
    console.error('No data received from web3.storage');
    return false;
  }

  // verify the node signature
  const isSignatureValid = await verifySignature(
    messageUint8Array,
    signatureUint8Array,
    publicKeyUint8Array,
  );

  return isSignatureValid;
};

async function verifySignature(message, signature, publicKey) {
  return nacl.sign.detached.verify(message, signature, publicKey);
}
