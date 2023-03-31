const { namespaceWrapper } = require("../namespaceWrapper");
const dataFromCid = require("../helpers/dataFromCid");
const getKeys = require("../helpers/getKey");
const hashCompare = require("../helpers/hashCompare");
const nacl = require('tweetnacl');

// let submission_value = "bafybeienyavolrhhaphslyvvjkeby6kkcufnfmeigrf2xlsegoqdnj5ch4"
async function test_cidValidation(submission_value) {
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
        const check = await verifySignature(linktreeIndexDataUint8Array, signature, publicKey);
        console.log("CHECK", check);
    
      
    } catch {
        console.log("ERROR");
    }
}

async function verifySignature(linktreeIndexData, signature, publicKey) {
    return nacl.sign.detached.verify(linktreeIndexData, signature, publicKey);
}

module.exports = test_cidValidation;

test_cidValidation(submission_value);