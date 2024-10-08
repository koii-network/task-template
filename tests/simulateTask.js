import { taskRunner } from "@_koii/task-manager";
import "../src/index.js";

const numRounds = process.argv[2] || 1;
const roundDelay = process.argv[3] || 5000;
const functionDelay = process.argv[4] || 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeTasks() {
  for (let i = 0; i < numRounds; i++) {
    let round = i;
    await taskRunner.task(round);
    await sleep(functionDelay);
    await taskRunner.submitTask(round);
    await sleep(functionDelay);
    await taskRunner.auditTask(round);
    await sleep(functionDelay);
    await taskRunner.selectAndGenerateDistributionList(round);
    await sleep(functionDelay);
    await taskRunner.auditDistribution(round);
    if (i < numRounds - 1) {
      await sleep(roundDelay);
    }
  }
  console.log("All tasks executed. Test completed.");
  process.exit(0);
}

executeTasks();
