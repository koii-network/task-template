const dataFromCid = require("./helpers/dataFromCid");
const db = require('./db_model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

module.exports = async (submission_value, round) => {
  console.log('******/ Linktree CID VALIDATION Task FUNCTION /******');
  const outputraw = await dataFromCid(submission_value);
  const output = outputraw.data;

  console.log('RESPONSE DATA length', output.proofs.LENGTH);
  console.log('PUBLIC KEY', output.publicKey);
  console.log('SIGNATURE', output.signature);

  // TODO - can we safely remove this, from a game theory perspective?
  // Check that the node who submitted the proofs is a valid staked node
  let isNode = await verifyNode(output.proofs, output.signature, output.publicKey);
  console.log("Is the node's signature on the CID payload correct?", isNode);

  // check each item in the linktrees list and verify that the node is holding that payload, and the signature matches
  let isLinktree = await verifyLinktree(output.proofs);

  if (isNode && isLinktree) return true; // if both are true, return true
  else return false; // if one of them is false, return false
}

// verify the linktree signature by querying the other node to get it's copy of the linktree
async function verifyLinktree(proofs_list_object) {
  let allSignaturesValid = true;
  let AuthUserList = await db.getAllAuthLists();
  console.log('Authenticated Users List:', AuthUserList);
  console.log('IS LINKTREE True?', isLinktree);
  
  for (const proofs of proofs_list_object) {

    const linktree_object = await db.getLinktree(proofs.value[0].publicKey); // TODO - replace this with a call to the other node
    // TODO #2  - once you've done this, be sure to ignore any duplicates for the same node for the same pubkey, otherwise multiple updates in one round will cause audits
    const messageUint8Array = new Uint8Array(
      Buffer.from(JSON.stringify(linktree_object.data)),
    );

    // check if the user's pubkey is on the authlist
    if ( !AuthUserList.contains(proofs.value[0].publicKey) ) {
        // if not, check the node that supplied this proof, and verify that this user is in fact authorized

        // TODO write logic to query other node and verify registration events
        /*
          1. REST API that returns a user's registration proof and accepts :pubkey
          2. Add logic here to verify 'proofs' from (1) and then add the user to the AuthUserList
        */

        // TODO - add the user to the AuthUserList (might need to be updated later)
        await db.setAuthList(publicKey);
        
    } else {
        // TODO - flush this out more, might need to add an automatic update on the AuthUserList to ensure that this node is always up to date
        console.log('found invalid linktree data')
              

        // TODO - fix the array structure so you don't have to do this lol
        const signature = proofs.value[0].signature;
        const publicKey = proofs.value[0].publicKey;
        const signatureUint8Array = bs58.decode(signature);
        const publicKeyUint8Array = bs58.decode(publicKey);

        // verify the linktree signature
        const isSignatureValid = await verifySignature(
          messageUint8Array,
          signatureUint8Array,
          publicKeyUint8Array,
        );
        console.log(`IS SIGNATURE ${publicKey} VALID?`, isSignatureValid);

      }

    if (isSignatureValid) {
            
    } else {
      allSignaturesValid = false;
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
