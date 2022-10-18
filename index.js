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
  // Run default setup
  namespaceWrapper.defaultTaskSetup();
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
  if (NODE_MODE == NODE_MODE_SERVICE) {
    // Submission Logic
    cron.schedule('*/40 * * * *', () => task());
  }
  // Voting Logic
  cron.schedule('*/60 * * * *', () => {
    namespaceWrapper.validateAndVoteOnNodes(validateNode);
  });
}

setup().then(execute);

if (app) {
  //  Write your Express Endpoints here.
  //  For Example
  //  namespace.express('post', '/accept-cid', async (req, res) => {})
}
