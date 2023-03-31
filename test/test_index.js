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
    const cid = await cidCreation();
    // 3 test the validation of the cid
    const check = await cidValidation(cid)
    // 4 iterate over the cid and create distribution
    // 5 audit the distribution
}


async function cidCreation(){
    console.log("******/  TEST Linktree CID CREATION Task FUNCTION /******");
    const keyPair = nacl.sign.keyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;
    // Get linktree list fron localdb
    const linktrees_list_string = await namespaceWrapper.storeGet("linktrees");
    const linktrees_list_object = JSON.parse(linktrees_list_string);

    const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(linktrees_list_object)));
    const signedMessage = nacl.sign(messageUint8Array, privateKey);
    const signature = signedMessage.slice(0, nacl.sign.signatureLength);

    const submission_value = {
        data: linktrees_list_object,
        publicKey: bs58.encode(publicKey),
        signature: bs58.encode(signature),
    }
    // upload the index of the linktree on web3.storage
    const path = `testLinktree/test.json`;
    console.log("PATH", path);
    if (!fs.existsSync("testLinktree")) fs.mkdirSync("testLinktree");
    await createFile(path, submission_value);

    if (storageClient) {
        const file = await getFilesFromPath(path);
        const cid = await storageClient.put(file);
        console.log("User Linktrees uploaded to IPFS: ", cid);

        // deleting the file from fs once it is uploaded to IPFS
        await deleteFile(path);

        // Store the cid in localdb
        try {
            await namespaceWrapper.storeSet("testlinktree", cid);
        } catch (err) {
            console.log("ERROR IN STORING test linktree", err);
            res.status(404).json({ message: "ERROR in storing test linktree" });
        }
        return cid
    } else {
        console.log("NODE DO NOT HAVE ACCESS TO WEB3.STORAGE");
    }
}


async function cidValidation(submission_value) {
    console.log("******/  TEST Linktree CID VALIDATION Task FUNCTION /******");
    const outputraw = await dataFromCid(submission_value);
    const output = outputraw.data
    // for ()
    const linktrees_list_object = output.data;
    console.log("RESPONSE DATA", linktrees_list_object);
    const publicKey = output.publicKey;
    console.log("PUBLIC KEY", publicKey);
    const signature = output.signature;
    console.log("SIGNATURE", signature);

    const messageUint8Array = new Uint8Array(Buffer.from(JSON.stringify(linktrees_list_object)));
    const signatureUint8Array = bs58.decode(signature);
    const publicKeyUint8Array = bs58.decode(publicKey);

    if (!linktrees_list_object || !signature || !publicKey) {
        console.error("No data received from web3.storage");
        return false;
    }

    // verify the signature
    const isSignatureValid = await verifySignature(messageUint8Array, signatureUint8Array, publicKeyUint8Array);
    console.log(`Is the signature valid? ${isSignatureValid}`);
    
    return isSignatureValid;
}

async function verifySignature(linktreeIndexData, signature, publicKey) {
    return nacl.sign.detached.verify(linktreeIndexData, signature, publicKey);
}
test();