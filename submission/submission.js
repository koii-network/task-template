const { namespaceWrapper } = require('../_koiiNode/koiiNode');
const crypto = require('crypto');

async function task() {
  try {
    const value = 'Hello, World!';

    if (value) {
      // store value on NeDB
      await namespaceWrapper.storeSet('value', value);
    }
  } catch (err) {
    console.log('ERROR IN EXECUTING TASK', err);
  }
}
async function fetchSubmission() {
  const value = await namespaceWrapper.storeGet('value'); // retrieves the value
  console.log('VALUE', value);
  return value;
}
// Submit Address with distribution list to K2
async function submitTask(roundNumber) {
  try {
    const submission = await this.fetchSubmission();
    console.log('SUBMISSION', submission);
    await namespaceWrapper.checkSubmissionAndUpdateRound(
      submission,
      roundNumber,
    );
  } catch (error) {
    console.log('error in submission', error);
  }
}

module.exports = {
  task,
  fetchSubmission,
  submitTask,
};
