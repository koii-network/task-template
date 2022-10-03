/**
 * TODO Test this more
 */
const cron = require('node-cron');
const NODE_MODE_SERVICE = 'service';
const {app, NODE_MODE} = require('./init');
const {namespaceWrapper} = require('./namespaceWrapper');
const {Transaction, SystemProgram, PublicKey, Keypair, Connection, LAMPORTS_PER_SOL,} = require('@_koi/web3.js');
const fs = require('fs');

//TASK SPECIFIC  STRUCTURE : Add the API controllers over here
const didCoreLogic = require('./DidTaskLogic/coreLogic/index');
const didApis = require('./Did_apis/index');


// DID TASK DEPENDENCIES

const axios = require('axios');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
const crypto = require('crypto');

const { Web3Storage, getFilesFromPath } = require('web3.storage');
const storageClient = new Web3Storage({ token: process.env.WEB3_STORAGE_KEY });
const fsPromise = require('fs/promises');

// Global variables needed in  the task 

let taskAccountInfo;
let submitterAccountKeyPair;
let submitterPubkey;
let stakingPubKey;
let connection;
let round;
let voteStatus;
let stakeStatus;
let submitterAccountWallet;

/**
 * @description Setup function is the first  function that is called in executable to setup the node
 */
async function setup() {

  //TESTING CODE 

  // console.log('setup function called');
  // console.log(await namespaceWrapper.storeGet('testKey'));
  // console.log(await namespaceWrapper.storeSet('testKey', 'testValue'));
  // console.log(await namespaceWrapper.storeGet('testKey'));

  // const createSubmitterAccTransaction = new Transaction().add(
  //   SystemProgram.transfer({
  //     fromPubkey: new PublicKey('FnQm11NXJxPSjza3fuhuQ6Cu4fKNqdaPkVSRyLSWf14d'),
  //     toPubkey: new PublicKey('9GWMkJ43dRcqy8u1cudWDTwuBSciEWHr2nTMZEFxuR3F'),
  //     lamports: 1000000,
  //   })
  // );
  // console.log('MY TRANSACTION STARTING');
  // let submitterAccount = Keypair.fromSecretKey(
  //   Uint8Array.from(JSON.parse(fs.readFileSync('/home/ghazanfer/.config/koii/id.json', 'utf-8')))
  // );
 
  // await namespaceWrapper.sendAndConfirmTransactionWrapper(createSubmitterAccTransaction, [
  //   submitterAccount,
  // ]);


  namespaceWrapper.defaultTaskSetup();

  // console.log("MY TRANSACTION STARTING END")
  // namespaceWrapper.sendAndConfirmTransactionWrapper()
  // console.log(namespace.taskTxId, namespace.operationMode);
  // Run default setup
  // namespace.defaultTaskSetup();
  // Run any extra setup
}

/**
 * @description Execute function is called just after the setup function  to run Submit, Vote API in cron job
 */
async function execute() {
  console.log('EXECUTE THE TASK HERE');
  console.log('NODE MODE', process.env.NODE_MODE);
  let cronArray = [];
  if (process.env.NODE_MODE == NODE_MODE_SERVICE) {
    cronArray.push(
      cron.schedule('*/300 * * * *', didCoreLogic.checkSubmissionAndUpdateRound),
    );
  }
  await didCoreLogic.checkSubmissionAndUpdateRound();
  //cronArray.push(cron.schedule('*/50 * * * *', checkVoteStatus));
  //await checkVoteStatus();
  //cronArray.push(cron.schedule('*/90 * * * *', checkVoting));
  //await checkVoting();
  //await userIndex();
  // return cronArray;
}

setup().then(execute);

if (app) {
  // Write your Express Endpoints here.

  app.express('post', '/register', didApis.registerDID);
  app.express('get', '/did/:did_id', didApis.fetchDID);
  app.express('post', '/update/:did_id', didApis.updateDID);

  // TODO  ENDPOINTS

  app.express('post', '/attest/request', didApis.requestAttestations);

  //This  function  is  for  worker node  task
  app.express('post', '/attest/create', didApis.attestCreation);
  app.express('get', 'attest/pending', didApis.pendingAttestations);

  // app.express('get', '/proofs', proofDID);
}