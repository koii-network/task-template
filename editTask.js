const { namespaceWrapper } = require('@_koii/namespace-wrapper');

async function executeTask(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the makeSubmission function
  console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
  // you can optionally return this value to be used in debugging
  await namespaceWrapper.storeSet('value', 'Hello, World!');
}

async function makeSubmission(roundNumber) {
  // Submit your task proofs for auditing
  console.log(`MAKE SUBMISSION FOR ROUND ${roundNumber}`);
  return await namespaceWrapper.storeGet('value');
}

async function auditSubmission(submission, roundNumber) {
  // Audit a submission
  // This function should return true if the submission is correct, false otherwise
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);
  return submission === 'Hello, World!';
}

async function makeRewardList(round, submitters, bounty) {
  console.log(`MAKE REWARD LIST FOR ROUND ${round}`);
  const rewardList = {};
  const approvedSubmitters = [];
  // Slash the stake of submitters who submitted incorrect values
  // and make a list of submitters who submitted correct values
  for (const submitter of submitters) {
    rewardList[submitter] = 0;
    if (submitter.votes < 0) {
      const slashedStake = submitter.stake * 0.7;
      rewardList[submitter.publicKey] = -slashedStake;
      console.log('CANDIDATE STAKE SLASHED', submitter.publicKey, slashedStake);
    } else {
      approvedSubmitters.push(submitter.publicKey);
    }
  }
  // reward the submitters who submitted correct values
  const reward = Math.floor(bounty / approvedSubmitters.length);
  console.log('REWARD PER NODE', reward);
  approvedSubmitters.forEach(candidate => {
    rewardList[candidate] = reward;
  });
  return rewardList;
}

module.exports = {
  executeTask,
  makeSubmission,
  auditSubmission,
  makeRewardList,
};
