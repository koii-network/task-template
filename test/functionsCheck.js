/*
This file helps you in testing the functions that you need to develop for the tasks before submitting it to K2.
*/
const coreLogic = require("../coreLogic");

async function main() {
  console.log("IN TESTING TASK");

  // Testing the task function
  const task = await coreLogic.task();
  console.log(task);

  //Test submit distributoin function
  // const submitDistributionList = await coreLogic.submitDistributionList();
  // console.log(submitDistributionList);
}

main();
