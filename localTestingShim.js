const coreLogic = require("./coreLogic");
// TEST Set round
let round = 1000
const localShim = async () => {

  /* GUIDE TO CALLS K2 FUNCTIONS MANUALLY

  If you wish to do the development by avoiding the timers then you can do the intended calls to K2 
  directly using these function calls. 

  To disable timers please set the TIMERS flag in task-node ENV to disable

  NOTE : K2 will still have the windows to accept the submission value, audit, so you are expected
  to make calls in the intended slots of your round time. 

  */

  console.log("*******************TESTING*******************")
  // Get the task state 
  // console.log(await namespaceWrapper.getTaskState());

  // Get account public key
  // console.log(MAIN_ACCOUNT_PUBKEY);

  // GET ROUND 
  // const round = await namespaceWrapper.getRound();
  // console.log("ROUND", round);


  // Call to do the work for the task
  await coreLogic.task();

  // Submission to K2 (Preferablly you should submit the cid received from IPFS)
  await coreLogic.submitTask(round - 1);

  // Audit submissions 
  await coreLogic.auditTask(round - 1);

  // upload distribution list to K2

  //await coreLogic.submitDistributionList(round - 2)

  // Audit distribution list

  //await coreLogic.auditDistribution(round - 2);

  // Payout trigger

  // const responsePayout = await namespaceWrapper.payoutTrigger();
  // console.log("RESPONSE TRIGGER", responsePayout);

}

module.exports = localShim;