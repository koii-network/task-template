/**
 * TODO Test this more
 */
 const cron = require('node-cron');
 const NODE_MODE_SERVICE = 'service';
 const task = require("./coreLogic")
 /**
  * @description Setup function is the first  function that is called in executable to setup the node
  */
 async function setup() {
   console.log('setup function called');
   console.log(namespace.taskTxId,namespace.operationMode)
   // Run default setup
   namespace.defaultTaskSetup();
   // Run any extra setup
 }
 
 /*
  * @description Using to validate an individual node.
  */
 async function validateNode(node) {
   console.log("Validating Node", node);
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
   console.log('NODE MODE', process.env.NODE_MODE);
   let cronArray = [];
   if (process.env.NODE_MODE == NODE_MODE_SERVICE) {
     cronArray.push(
       cron.schedule('*/40 * * * *', ()=>task(namespace)),
     );
   }
   cronArray.push(cron.schedule('*/60 * * * *', () => { namespace.validateAndVoteOnNodes(validateNode) }));
 
   return cronArray;
 }
 
 
//  if (namespace.app) {
  //  Write your Express Endpoints here.
  //  For Example
  //  namespace.express('post', '/accept-cid', async (req, res) => {})
//  }
 
 global.setup=setup
 global.execute=execute

