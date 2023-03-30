const { namespaceWrapper } = require("./namespaceWrapper");
const createFile = require("./helpers/createFile.js");
const deleteFile = require("./helpers/deleteFile");
const fs = require("fs");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const storageClient = new Web3Storage({
  token: process.env.SECRET_WEB3_STORAGE_KEY,
});
const { MAIN_ACCOUNT_PUBKEY } = require("./init");
const crypto = require("crypto");

module.exports = async() => {
    console.log("******/  IN Linktree Task FUNCTION /******");
    // Customize linktree test data
    console.log("Getting linktrees list");
    const linktrees_list_string = await namespaceWrapper.storeGet("linktrees");
    const linktrees_list_object = JSON.parse(linktrees_list_string);
    console.log("Getting linktrees list", linktrees_list_object);

    // loop through the linktrees_list to get the userIndex and upload then to web3.storage
    const linktrees_list = Object.keys(linktrees_list_object);
    for (let i = 0; i < Object.keys(linktrees_list).length; i++) {
      const linktrees = linktrees_list[i].data.linktree;
      console.log("linktrees", linktrees);
  
      if (linktrees_list_object[linktrees] == "yes") {
        console.log(`${linktrees} was updated so adding that index`);
        //fetching the user index of that linktrees
        // const linktree_data_string = await namespaceWrapper.storeGet(linktrees);
        const linktree_data_array = JSON.parse(linktrees);
        console.log("Getting user index", linktree_data_array);
  
        const linktree_data = {};
  
        linktree_data[linktrees] = linktree_data_array;
  

    console.log('SUBMISSION VALUE', linktree_data);

    const linktree_data_payload = JSON.stringify(linktree_data);

    const hashLinktreeIndex = crypto
    .createHash("sha256")
    .update(linktree_data_payload)
    .digest("hex");

    console.log("HASH OF LINKTREE INDEX", hashLinktreeIndex);

    // singing the payload using the nodes private key and sending the public key along with the payload
    const signature = await namespaceWrapper.payloadSigning(hashLinktreeIndex);

    console.log("SIGNATURE ON HASH OF LINKTREE INDEX", signature);

    const indexSignature = {
    data: linktree_data,
    signature: signature,
    pubKey: MAIN_ACCOUNT_PUBKEY,
    };

    console.log("INDEX SIGNATURE DATA", indexSignature);

    // upload the index of the linktree on web3.storage
    const path = `userIndex/test.json`;
    console.log("PATH", path);
    if (!fs.existsSync("userIndex")) fs.mkdirSync("userIndex");
    await createFile(path, indexSignature);

    if (storageClient) {
    const file = await getFilesFromPath(path);
    const cid = await storageClient.put(file);
    console.log("User index uploaded to IPFS: ", cid);

    // deleting the file from fs once it is uploaded to IPFS
    await deleteFile(path);

    // Store the cid in level db
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
}
};
