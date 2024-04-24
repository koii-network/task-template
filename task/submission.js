const { namespaceWrapper, TASK_ID } = require('../_koiiNode/koiiNode');
const { default: axios } = require('axios');
const { createHash } = require('crypto');
class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {void}
   */
  async task(round) {
    try {
      console.log('ROUND', round);
      const taskState = await namespaceWrapper.getTaskState();
      console.log('TASK STATE', taskState);
      let randomNode;

      try {
        // pick a random one from nodeList and use axios to fetch data
        const nodeList = taskState.ip_address_list;
        randomNode = nodeList[Math.floor(Math.random() * nodeList.length)];
        console.log('RANDOM NODE', randomNode);
        const response = await axios.get(`${randomNode}/task/${TASK_ID}/value`);
        const value = response.data.value;
        console.log('VALUE', value);
        // Store the result in NeDB (optional)
        if (value) {
          await namespaceWrapper.storeSet('value', value);
        }
        // Optional, return your task
        return value;
      } catch (error) {
        console.log('ERROR IN FETCHING IP ADDRESS, TRY PROXY TUNNEL');
        const stakeList = taskState.stake_list;

        const keys = Object.keys(stakeList);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex];

        console.log(randomKey, 'publicKey');
        const hash = createHash('sha256').update(randomKey).digest('hex');
        // console.log(hash, "hash");
        randomNode = hash.substring(0, 36) + '-proxy.koiidns.com';
        console.log('RANDOM NODE', randomNode);
        const response = await axios.get(
          `https://${randomNode}/task/${TASK_ID}/value`,
        );
        // const response = await axios.get(`https://f39cc474ac41c52b0e65a68cc574ddbf7a61-proxy.koiidns.com/task/6yHNyLocR7b9YFtajRAhXzmL5rGHLNR3yFTtgjADG2B9/value`);
        if (response.status === 200 && response.data.value) {
          const value = response.data.value;
          console.log('VALUE', value);
          // Store the result in NeDB (optional)
          if (value) {
            await namespaceWrapper.storeSet('value', value);
          }
          // Optional, return your task
          return value || null;
        } else if (response.data.message) {
          console.log('ERROR IN FETCHING VALUE', response.data.message);
        }
      }
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
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
      console.log('SUBMIT TASK SLOT', await namespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
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
   *
   */
  async fetchSubmission(round) {
    console.log('FETCH SUBMISSION');
    // Fetch the value from NeDB
    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    // Return cid/value, etc.
    return value;
  }
}
const submission = new Submission();
module.exports = { submission };
