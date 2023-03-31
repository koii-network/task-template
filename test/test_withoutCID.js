// test validation without cid
const { namespaceWrapper } = require("../namespaceWrapper");
const createFile = require("../helpers/createFile.js");
const deleteFile = require("../helpers/deleteFile");
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const fs = require("fs");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const storageClient = new Web3Storage({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY0ODYxMzAzOTdDNTY1QzlDYTRCOTUzZTA2RWQ4NUI4MGRBQzRkYTIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjYzNjU1OTk5MDMsIm5hbWUiOiJTb21hIn0.TU-KUFS9vjI9blN5dx6VsLLuIjJnpjPrxDHBvjXQUxw",
  });
const dataFromCid = require("../helpers/dataFromCid");

async function test() {
    // 1 test submission
    // await test_submission();
    // 2 test the cid creation (CID need to contain all of the linktree data and signature)
    const submission_value = await cidCreation();
    // 3 test the validation of the cid
    const check = await cidValidation(submission_value)
    // 4 iterate over the cid and create distribution
    // 5 audit the distribution
}


async function cidCreation(){
    console.log("******/  TEST Linktree CID CREATION Task FUNCTION /******");
    // Get linktree list fron localdb
    // const linktrees_list_string = await namespaceWrapper.storeGet("linktrees");
    
    const linktrees_list_object = {
        data: "data",
            publicKey: '7AwybFMYogGa8LJ3n9i8QthUs6ybEcanC8UPejM76U7h',
            signature: 'P6McSGFMniTdaH5546b8b1xuL91UtjxS9RnXMxBcg8ewuvKuFwijqJHH9BSZnEnqs1niE1xx7DreRVCNqK4ZJSE'
    };
    const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(linktrees_list_object)));
    const secretKey = nacl.sign.keyPair().secretKey;
    const publicKey = nacl.sign.keyPair().publicKey;

    const signedMessage = nacl.sign(messageUint8Array, secretKey);
    const signature = signedMessage.slice(0, nacl.sign.signatureLength);
    // console.log('Check Signature:', bs58.encode(signature));

    const submission_value = {
        data: linktrees_list_object,
        publicKey: bs58.encode(publicKey),
        signature: bs58.encode(signature),
    }
    // upload the index of the linktree on web3.storage
    return submission_value
}


async function cidValidation(submission_value) {
    console.log("******/  TEST Linktree CID VALIDATION Task FUNCTION /******");
    const output = submission_value
    console.log("RESPONSE DATA", output.data);
    // for ()
    const linktreeIndexData = output.data;
    const publicKey = output.publicKey;
    console.log("PUBLIC KEY", publicKey);
    const signature = output.signature;
    console.log("SIGNATURE", signature);
    if (!output.data || !signature || !publicKey) {
        console.error("No data received from web3.storage");
        return false;
    }

    // verify the signature
    const linktreeIndexDataUint8Array = new Uint8Array(Buffer.from(JSON.stringify(linktreeIndexData)));
    const signatureUint8Array = bs58.decode(signature);
    const publicKeyUint8Array = bs58.decode(publicKey);
    // console.log("Data wait to verify", linktreeIndexDataUint8Array);
    const check = await verifySignature(linktreeIndexDataUint8Array, signatureUint8Array, publicKeyUint8Array);
    console.log(`Is the signature valid? ${check}`);
    
    return check;
}

async function verifySignature(linktreeIndexData, signature, publicKey) {
    return nacl.sign.detached.verify(linktreeIndexData, signature, publicKey);
}
test();