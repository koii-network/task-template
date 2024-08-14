const { NamespaceWrapper } = require('@_koii/namespace-wrapper');

class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {void}
   */
  async task(round) {
    console.log('ROUND', round);
    // Edit your task logic here and generate a value for submission. If you want to use a file as your submission, use our IPFS service here: https://www.koii.network/docs/develop/write-a-koii-task/task-development-kit-tdk/using-the-task-namespace/koii-storage
    const value = 'Hello, World!';
    // Store the result in NeDB (optional)
    if (value) {
      await NamespaceWrapper.storeSet('value', value);
    }
    // Optional, return your task
    return value;
  }

  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(round) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER', round);
    try {
      console.log('SUBMIT TASK SLOT', await NamespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await NamespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
      console.log('SUBMISSION CHECKED AND ROUND UPDATED');
      return submission;
    } catch (error) {
      console.log('ERROR IN SUBMISSION', error);
    }
  }

  /**
   * Fetches the submission value
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit. It can be the real value, cid, etc.
   */
  async fetchSubmission(round) {
    console.log(`FETCH SUBMISSION FOR ROUND ${round}`);
    const value = await NamespaceWrapper.storeGet('value'); 
    return value;
  }
}

const submission = new Submission();
module.exports = { submission };
