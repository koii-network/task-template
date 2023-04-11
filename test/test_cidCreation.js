const createFile = require('../helpers/createFile.js');
const deleteFile = require('../helpers/deleteFile');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const { namespaceWrapper } = require('../namespaceWrapper');
const fs = require('fs');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const storageClient = new Web3Storage({
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY0ODYxMzAzOTdDNTY1QzlDYTRCOTUzZTA2RWQ4NUI4MGRBQzRkYTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjYzNjU1OTk5MDMsIm5hbWUiOiJTb21hIn0.TU-KUFS9vjI9blN5dx6VsLLuIjJnpjPrxDHBvjXQUxw',
});

async function cidcreation() {
  console.log('******/  IN Linktree Task FUNCTION /******');
  // Customize linktree test data
  const keyPair = nacl.sign.keyPair();
  const publicKey = keyPair.publicKey;
  const privateKey = keyPair.secretKey;
  // Get linktree list fron localdb
  const proofs_list_string = await namespaceWrapper.storeGet(`proofs:${round}`);
  const proofs_list_object = JSON.parse(proofs_list_string);

  const messageUint8Array = new Uint8Array(
    Buffer.from(JSON.stringify(proofs_list_object)),
  );
  const signedMessage = nacl.sign(messageUint8Array, privateKey);
  const signature = signedMessage.slice(0, nacl.sign.signatureLength);

  const submission_value = {
    proofs: proofs_list_object,
    node_publicKey: bs58.encode(publicKey),
    node_signature: bs58.encode(signature),
  };
  // upload the index of the linktree on web3.storage
  const path = `./Linktree/proofs.json`;
  if (!fs.existsSync('./Linktree')) fs.mkdirSync('./Linktree');
  console.log('PATH', path);
  await createFile(path, submission_value);

  if (storageClient) {
    const file = await getFilesFromPath(path);
    const proof_cid = await storageClient.put(file);
    console.log('User Linktrees proof uploaded to IPFS: ', proof_cid);

    // deleting the file from fs once it is uploaded to IPFS
    await deleteFile(path);

    return proof_cid;
    
  } else {
    console.log('NODE DO NOT HAVE ACCESS TO WEB3.STORAGE');
  }
};

cidcreation();
module.exports = cidcreation;
