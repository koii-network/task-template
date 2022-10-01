const {default: axios} = require('axios');
const BASE_ROOT_URL = 'http://localhost:8080/namespace-wrapper';
const {TASK_ID, MAIN_ACCOUNT_PUBKEY, SECRET_KEY} = require('./init');
const {Connection, PublicKey} = require('@_koi/web3.js');

let connection;
const namespaceWrapper = new NamespaceWrapper();
namespaceWrapper.getRpcUrl().then((rpcUrl) => {
  connection = new Connection(rpcUrl, 'confirmed');
});

class NamespaceWrapper {
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  async storeGet(key) {
    return await genericHandler('storeGet', key);
  }
  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   * @returns {Promise<void>}
   */
  async storeSet(key, value) {
    return await genericHandler('storeSet', key, value);
  }
  //   /**
  //    * Namespace wrapper over fsPromises methods
  //    * @param {*} method The fsPromise method to call
  //    * @param {*} path Path for the express call
  //    * @param  {...any} args Remaining parameters for the FS call
  //    * @returns {Promise<any>}
  //    */
  //   async fs(method, path, ...args) {}
  //   async fsStaking(method, path, ...args) {}
  //   async fsWriteStream(imagepath: string) {}
  //   async fsReadStream(imagepath: string) {}

  async submissionOnChain(taskStateInfoKeypairPubKey, submitterKeypair, submission) {
    return await genericHandler('submissionOnChain', taskStateInfoKeypairPubKey, submitterKeypair, submission);
  }
  async voteOnChain(taskStateInfoKeypairPubKey, submitterPubkey, voterKeypair, isValid) {
    return await genericHandler('voteOnChain', taskStateInfoKeypairPubKey, submitterPubkey, voterKeypair, isValid);
  }
  async stakeOnChain(taskStateInfoPublicKey, stakingAccKeypair, stakePotAccount, stakeAmount) {
    return await genericHandler(
      'stakeOnChain',
      taskStateInfoPublicKey,
      stakingAccKeypair,
      stakePotAccount,
      stakeAmount
    );
  }
  async claimReward(taskStateInfoAddress, stakePotAccount, beneficiaryAccount, claimerKeypair) {
    return await genericHandler(
      'claimReward',
      taskStateInfoAddress,
      stakePotAccount,
      beneficiaryAccount,
      claimerKeypair
    );
  }
  async sendTransaction(serviceNodeAccount, beneficiaryAccount, amount) {
    return await genericHandler('sendTransaction', serviceNodeAccount, beneficiaryAccount, amount);
  }
  async getSubmitterAccount() {
    return await genericHandler('getSubmitterAccount');
  }
  /**
   * sendAndConfirmTransaction wrapper that injects mainSystemWallet as the first signer for paying the tx fees
   * @param {connection} method // Receive method ["get", "post", "put", "delete"]
   * @param {transaction} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  async sendAndConfirmTransactionWrapper(transaction, signers) {
    const blockhash = (await connection.getRecentBlockhash('finalized')).blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(MAIN_ACCOUNT_PUBKEY);
    return await genericHandler(
      'sendAndConfirmTransactionWrapper',
      transaction.serialize({requireAllSignatures: false, verifySignatures: false}),
      signers
    );
  }
  async getTaskState() {
    return await genericHandler('getTaskState');
  }
  async checkVoteStatus() {
    return await genericHandler('checkVoteStatus');
  }
  async checkSubmissionAndUpdateRound(submissionValue = 'default') {
    return await genericHandler('checkSubmissionAndUpdateRound', submissionValue);
  }
  async getProgramAccounts() {
    return await genericHandler('getProgramAccounts');
  }
  async defaultTaskSetup() {
    return await genericHandler('defaultTaskSetup');
  }
  async getRpcUrl() {
    return await genericHandler('getRpcUrl');
  }
}
async function genericHandler(...args) {
  try {
    let response = await axios.post(BASE_ROOT_URL, {
      args,
      taskId: TASK_ID,
      secret: SECRET_KEY,
    });
    if (response.status == 200) return response.data;
    else {
      console.error(response.status, response.data);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}
module.exports = {
  namespaceWrapper,
};
