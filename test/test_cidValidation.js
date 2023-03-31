const { namespaceWrapper } = require("../namespaceWrapper");
const dataFromCid = require("../helpers/dataFromCid");
const getKeys = require("../helpers/getKey");
const hashCompare = require("../helpers/hashCompare");
const nacl = require('tweetnacl');

// let submission_value = "bafybeienyavolrhhaphslyvvjkeby6kkcufnfmeigrf2xlsegoqdnj5ch4"
async function test_cidValidation(submission_value) {
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

async function verifySignature(message, signature, publicKey) {
    return nacl.sign.detached.verify(message, signature, publicKey);
}

module.exports = test_cidValidation;

test_cidValidation(submission_value);