import {
  task,
  submitDistributionList,
  submitTask,
  auditTask,
  auditDistribution,
} from "./coreLogic";
import { app } from "./init";
import { namespaceWrapper } from "./namespaceWrapper";

async function setup() {
  console.log("setup function called");
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on("message", (m: any) => {
    console.log("CHILD got message:", m);
    if (m.functionCall == "submitPayload") {
      console.log("submitPayload called");
      submitTask(m.roundNumber);
    } else if (m.functionCall == "auditPayload") {
      console.log("auditPayload called");
      auditTask(m.roundNumber);
    } else if (m.functionCall == "executeTask") {
      console.log("executeTask called");
      task();
    } else if (m.functionCall == "generateAndSubmitDistributionList") {
      console.log("generateAndSubmitDistributionList called");
      submitDistributionList(m.roundNumber);
    } else if (m.functionCall == "distributionListAudit") {
      console.log("distributionListAudit called");
      auditDistribution(m.roundNumber);
    }
  });
}

setup();

/* GUIDE TO CALLS K2 FUNCTIONS MANUALLY

  If you wish to do the development by avoiding the timers then you can do the intended calls to K2 
  directly using these function calls. 

  To disable timers please set the TIMERS flag in task-node ENV to disable

  NOTE : K2 will still have the windows to accept the submission value, audit, so you are expected
  to make calls in the intended slots of your round time. 

  */

// Get the task state
//console.log(await namespaceWrapper.getTaskState());

//GET ROUND

// const round = await namespaceWrapper.getRound();
// console.log("ROUND", round);

// Submission to K2 (Preferablly you should submit the cid received from IPFS)

//await submitTask(round - 1)

// Audit submissions

//await auditTask(round - 1)

// upload distribution list to K2

//await submitDistributionList(round - 2)

// Audit distribution list

//await auditDistribution(round - 2);

// Payout trigger

// const responsePayout = await namespaceWrapper.payoutTrigger();
// console.log("RESPONSE TRIGGER", responsePayout);

if (app) {
  //  Write your Express Endpoints here.
  //  For Example
  //  namespace.express('post', '/accept-cid', async (req, res) => {})
}
