const { namespaceWrapper } = require("../namespaceWrapper");
const dataFromCid = require("../helpers/dataFromCid");
const getKeys = require("../helpers/getKey");
const hashCompare = require("../helpers/hashCompare");
const crypto = require('crypto');

let submission_value = "bafybeienyavolrhhaphslyvvjkeby6kkcufnfmeigrf2xlsegoqdnj5ch4"
async function test_cidValidation(submission_value) {
    // const cid = submission_value;
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
        const check = await verifySignature( signature, linktreeIndexData, publicKey);
        console.log("CHECK", check);
    
      
    } catch {
        console.log("ERROR");
    }
}

async function verifySignature( signature, linktreeIndexData, publicKey) {
    const verifier = crypto.createVerify('SHA256');
    verifier.update(linktreeIndexData);
    return verifier.verify(publicKey, signature, 'base64');
}

module.exports = test_cidValidation;

test_cidValidation(submission_value);