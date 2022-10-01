/**
 * TODO Test this more
 */
const cron = require('node-cron');
const NODE_MODE_SERVICE = 'service';
const task = require('./coreLogic');
const {app, NODE_MODE} = require('./init');
const {namespaceWrapper} = require('./namespaceWrapper');
const {Transaction, SystemProgram, PublicKey, Keypair} = require('@_koi/web3.js');
const fs = require('fs');

/**
 * @description Setup function is the first  function that is called in executable to setup the node
 */
async function setup() {
  console.log('setup function called');
  console.log(await namespaceWrapper.storeGet('testKey'));
  console.log(await namespaceWrapper.storeSet('testKey', 'testValue'));
  console.log(await namespaceWrapper.storeGet('testKey'));

  const createSubmitterAccTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey('FnQm11NXJxPSjza3fuhuQ6Cu4fKNqdaPkVSRyLSWf14d'),
      toPubkey: new PublicKey('9GWMkJ43dRcqy8u1cudWDTwuBSciEWHr2nTMZEFxuR3F'),
      lamports: 1000000,
    })
  );
  console.log('MY TRANSACTION STARTING');
  let submitterAccount = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync('/home/ghazanfer/.config/koii/id.json', 'utf-8')))
  );
 
  await namespaceWrapper.sendAndConfirmTransactionWrapper(createSubmitterAccTransaction, [
    submitterAccount,
  ]);

  // console.log("MY TRANSACTION STARTING END")
  // namespaceWrapper.sendAndConfirmTransactionWrapper()
  // console.log(namespace.taskTxId, namespace.operationMode);
  // Run default setup
  // namespace.defaultTaskSetup();
  // Run any extra setup
}

/*
 * @description Using to validate an individual node.
 */
async function validateNode(node) {
  console.log('Validating Node', node);
  const cid = node.submission_value;
  const res = await client.get(cid);
  if (!res.ok) {
    return false;
  } else {
    return true;
  }
}

/**
 * @description Execute function is called just after the setup function  to run Submit, Vote API in cron job
 */
async function execute() {
  console.log('BTC to USD Script now running');
  console.log('NODE MODE', NODE_MODE);
  let cronArray = [];
  if (NODE_MODE == NODE_MODE_SERVICE) {
    // cronArray.push(cron.schedule('*/40 * * * *', () => task(namespace)));
  }
  cronArray.push(
    cron.schedule('*/60 * * * *', () => {
      // namespace.validateAndVoteOnNodes(validateNode);
    })
  );

  return cronArray;
}

setup().then(execute);

//  if (namespace.app) {
//  Write your Express Endpoints here.
//  For Example
//  namespace.express('post', '/accept-cid', async (req, res) => {})
//  }
