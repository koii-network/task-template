import { taskRunner } from "@_koii/task-manager";
import "../src/index.js";
import { namespaceWrapper } from "@_koii/namespace-wrapper";
import axios from "axios";
const numRounds = process.argv[2] || 1;
const roundDelay = process.argv[3] || 5000;
const functionDelay = process.argv[4] || 1000;

let TASK_TIME = 0;
let AUDIT_TIME = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
await namespaceWrapper.stakeOnChain();
async function executeTasks() {
  for (let i = 0; i < numRounds; i++) {
    let round = i;
    const taskStartTime = Date.now();
    await taskRunner.task(round);
    const taskEndTime = Date.now();

    if (taskEndTime - taskStartTime > TASK_TIME) {
      TASK_TIME = taskEndTime - taskStartTime;
    }
    await sleep(functionDelay);
    await taskRunner.submitTask(round);
    await sleep(functionDelay);
    const auditStartTime = Date.now();
    await taskRunner.auditTask(round);
    const auditEndTime = Date.now();
    if (auditEndTime - auditStartTime > AUDIT_TIME) {
      AUDIT_TIME = auditEndTime - auditStartTime;
    }
    await sleep(functionDelay);
    await taskRunner.selectAndGenerateDistributionList(round);
    await sleep(functionDelay);
    await taskRunner.auditDistribution(round);

    if (i < numRounds - 1) {
      await sleep(roundDelay);
    }

    const taskState = await namespaceWrapper.getTaskState({});
    const IP_list = Object.values(taskState.ip_address_list);
    for (let i = 0; i < IP_list.length; i++) {
      const response = await axios.get(`http://${IP_list[i]}:3000`);
      console.log(response.data);
    }
  }
  console.log("TIME METRICS BELOW");
  console.table([
    {
      Metric: "SIMULATED_AUDIT_WINDOW",
      Value: Math.ceil(TASK_TIME / 408) + " SLOTS",
    },
    {
      Metric: "SIMULATED_SUBMISSION_WINDOW",
      Value: Math.ceil(AUDIT_TIME / 408) + " SLOTS",
    },
  ]);

  console.log("All tasks executed. Test completed.");
  process.exit(0);
}

executeTasks();
