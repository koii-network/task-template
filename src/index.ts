/**
 * TODO Test this more
 */
 import  cron  from 'node-cron';
 import  {app, NODE_MODE}  from './init';
 import  {namespaceWrapper}  from './namespaceWrapper';
 import  {Transaction, SystemProgram, PublicKey, Keypair}  from '@_koi/web3.js';
 import  * as fs from 'fs';

 const NODE_MODE_SERVICE = 'service';
 /**
  * @description Setup function is the first  function that is called in executable to setup the node
  */
 async function setup():Promise<any> {
   console.log(app)
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
   const submitterAccount = Keypair.fromSecretKey(
     Uint8Array.from(JSON.parse(fs.readFileSync('/home/ghazanfer/.config/koii/id.json', 'utf-8')))
   );

   await namespaceWrapper.sendAndConfirmTransactionWrapper(createSubmitterAccTransaction, [
     submitterAccount,
   ]);

 }

 /*
  * @description Using to validate an individual node.
  */


 /**
  * @description Execute function is called just after the setup function  to run Submit, Vote API in cron job
  */
 async function execute():Promise<void> {
   console.log('BTC to USD Script now running');
   console.log('NODE MODE', NODE_MODE);
   const cronArray = [];
   if (NODE_MODE == NODE_MODE_SERVICE) {
     // cronArray.push(cron.schedule('*/40 * * * *', () => task(namespace)));
   }
   cronArray.push(
     cron.schedule('*/60 * * * *', () => {
       // namespace.validateAndVoteOnNodes(validateNode);
     })
   );


 }

 setup().then(execute);

 //  if (namespace.app) {
 //  Write your Express Endpoints here.
 //  For Example
 //  namespace.express('post', '/accept-cid', async (req, res) => {})
 //  }
