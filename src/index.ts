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

if (app) {
  //  Write your Express Endpoints here.
  //  For Example
  //  namespace.express('post', '/accept-cid', async (req, res) => {})
}
