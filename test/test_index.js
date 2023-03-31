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
    // Get linktree list fron localdb
    const linktrees_list_string = await namespaceWrapper.storeGet("linktrees");
    const linktrees_list_object = JSON.parse(linktrees_list_string);

    const msg = new TextEncoder().encode(JSON.stringify(linktrees_list_object));
    console.log("MSG", msg);
    const secretKey = nacl.sign.keyPair().secretKey;
    const signature = nacl.sign.detached(msg, secretKey);
    console.log('Check Signature:', bs58.encode(signature));
    const publicKey = nacl.sign.keyPair().publicKey;
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
    const output = await dataFromCid(submission_value);
    console.log("RESPONSE DATA", output.data);
    // for ()
    try {   
        const linktreeIndexData = output.data.data;
        const publicKey = output.data.publicKey;
        console.log("PUBLIC KEY", publicKey);
        const signature = output.data.signature;
        console.log("SIGNATURE", signature);
        if (!output.data || !signature || !publicKey) {
            console.error("No data received from web3.storage");
            return false;
        }

        // verify the signature
        const linktreeIndexDataUint8Array = new TextEncoder().encode(JSON.stringify(linktreeIndexData));
        console.log("MSG wait to verify", linktreeIndexDataUint8Array);
        const check = await verifySignature(linktreeIndexDataUint8Array, signature, publicKey);
        console.log("CHECK", check);
        
        return check;
      
    } catch {
        console.log("ERROR");
    }
}

async function verifySignature(linktreeIndexData, signature, publicKey) {
    return nacl.sign.detached.verify(linktreeIndexData, signature, publicKey);
}
test();