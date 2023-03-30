const test_submission = require('./test_submitLinktree');
const test_cidCreation = require('./test_cidCreation');
const test_cidValidation = require('./test_cidValidation');
const { namespaceWrapper } = require("../namespaceWrapper");

async function test() {
    // 1 test submission
    await test_submission();
    // 2 test the cid creation (CID need to contain all of the linktree data and signature)
    await test_cidCreation();
    const cid = await namespaceWrapper.storeGet("cid");
    // 3 test the validation of the cid
    await test_cidValidation(cid);
    // 4 iterate over the cid and create distribution
    // 5 audit the distribution
}

test();