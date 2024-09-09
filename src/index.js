import { namespaceWrapper, app } from '@_koii/namespace-wrapper';
import { initializeTaskManager } from '@_koii/task-runner';
import { setupRoutes } from './routes.js';

async function setup() {
  // define any steps that must be executed before the task starts
  console.log('CUSTOM SETUP');
  // you can define custom API routes in routes.js
  setupRoutes(app);
}

async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
  try {
    // you can optionally return this value to be used in debugging
    await namespaceWrapper.storeSet('value', 'Hello, World!');
  } catch (error) {
    console.error('EXECUTE TASK ERROR:', error);
  }
}

async function submission(roundNumber) {
  /**
   * Submit the task proofs for auditing
   * Must return a string of max 512 bytes to be submitted on chain
   */
  try {
    console.log(`MAKE SUBMISSION FOR ROUND ${roundNumber}`);
    return await namespaceWrapper.storeGet('value');
  } catch (error) {
    console.error('MAKE SUBMISSION ERROR:', error);
  }
}

async function audit(submission, roundNumber) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);
  return submission === 'Hello, World!';
}

function distribution(submitters, bounty, roundNumber) {
  /**
   * Generate the reward list for a given round
   * This function should return an object with the public keys of the submitters as keys
   * and the reward amount as values
   */
  const slashPercentage = 0.7;
  console.log(`MAKE REWARD LIST FOR ROUND ${roundNumber}`);
  const rewardList = {};
  const approvedSubmitters = [];
  // Slash the stake of submitters who submitted incorrect values
  // and make a list of submitters who submitted correct values
  for (const submitter of submitters) {
    rewardList[submitter.publicKey] = 0;
    if (submitter.votes < 0) {
      const slashedStake = submitter.stake * slashPercentage;
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

initializeTaskManager({
  setup,
  task,
  submission,
  audit,
  distribution,
});
