const dataFromCid = require("./helpers/dataFromCid");
const db = require('./db_model');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

module.exports = async (submission_value, round) => {
  console.log('******/ Linktree CID VALIDATION Task FUNCTION /******');
  const outputraw = await dataFromCid(submission_value);
  const output = outputraw.data;

  const proofs_list_object = output.proofs;
  console.log('RESPONSE DATA', proofs_list_object);
  const publicKey = output.node_publicKey;
  console.log('PUBLIC KEY', publicKey);
  const signature = output.node_signature;
  console.log('SIGNATURE', signature);

  let isNode = await verifyNode(proofs_list_object, signature, publicKey);
  console.log('IS NODE True?', isNode);

  let isLinktree = await verifyLinktree(proofs_list_object);
  let AuthUserList = await db.getAllAuthLists();
  console.log('Authenticated Users List:', AuthUserList);
  console.log('IS LINKTREE True?', isLinktree);

  if (isNode && isLinktree) return true; // if both are true, return true
  else return false; // if one of them is false, return false
}

async function verifyLinktree(proofs_list_object) {
  let allSignaturesValid = true;
  for (const proofs of proofs_list_object) {
    const linktree_object = await db.getLinktree(proofs.value[0].publicKey);
    const messageUint8Array = new Uint8Array(
      Buffer.from(JSON.stringify(linktree_object.data)),
    );
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

    if (isSignatureValid) {
      await db.setAuthList(publicKey);
    } else {
      allSignaturesValid = false;
    }
  }
  return allSignaturesValid;
}

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
