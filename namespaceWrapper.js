const {default: axios} = require('axios');
const BASE_ROOT_URL = 'http://localhost:8080/namespace-wrapper';
const {TASK_ID, MAIN_ACCOUNT_PUBKEY, SECRET_KEY} = require('./init');
const {Connection, PublicKey} = require('@_koi/web3.js');

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

  async submissionOnChain(submitterKeypair, submission) {
    return await genericHandler('submissionOnChain', submitterKeypair, submission);
  }
  async voteOnChain(candidatePubkey, isValid, voterKeypair) {
    return await genericHandler('voteOnChain', candidatePubkey, voterKeypair, isValid);
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
  async claimReward( stakePotAccount, beneficiaryAccount, claimerKeypair) {
    return await genericHandler(
      'claimReward',
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
  async validateAndVoteOnNodes(validation) {
    await this.checkVoteStatus();
    console.log("******/  IN VOTING /******");
    const taskAccountDataJSON = await this.getTaskState();
    const current_round = taskAccountDataJSON.current_round;
    const expected_round = current_round - 1;
    console.log("TASK DATA CURRENT ROUND", current_round);

    const status = taskAccountDataJSON.status;
    const stat_val = Object.keys(status)[0];
    console.log("STATUS", stat_val);

    const voteStatus = await namespaceWrapper.storeGet("voteStatus");
    console.log("Getting data VoteStatus", voteStatus);

    if (voteStatus == 'true' && stat_val == "Voting") {
      console.log("Now voting for the submission of last round");
      console.log("SUBMISSIONS", taskAccountDataJSON.submissions);
      const size = Object.keys(taskAccountDataJSON.submissions).length;
      console.log("SIZE", size);
      const values = Object.values(taskAccountDataJSON.submissions);
      const keys = Object.keys(taskAccountDataJSON.submissions);

      for (let i = 0; i < size; i++) {
        console.log("LOOP CALLING", i + 1);
        try {
          console.log("VALUE", values[i].round);
          if (expected_round == values[i].round) {
            console.log("LOGIC TO VOTE ON THIS ITEM");
            //fetch candidate public key
            let candidatePublicKey = keys[i];
            let candidateKeyPairPublicKey = new PublicKey(candidatePublicKey);
            console.log(
              "CANDIDATE KEY PAIR PUB KEY",
              candidateKeyPairPublicKey
            );
            console.log("CANDIDATE PUBLIC KEY", candidatePublicKey);
            console.log("SUBMITTER PUB KEY", MAIN_ACCOUNT_PUBKEY);
            if (candidatePublicKey == MAIN_ACCOUNT_PUBKEY) {
              console.log("YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS");
            } else {
              // Write the logic for checking the submissions here and if the submissions is okay then call the Vote function
              let vote;
              console.log("SUBMISSION VALUE", values[i].submission_value);
              const masterIndex = values[i].submission_value;

              console.log("MASTERINDEX", masterIndex);
              vote = await validation(masterIndex);
              console.log("VOTE", vote);

              console.log(`Voting ${vote} to ${candidatePublicKey}`);
              try {
                const response = await this.voteOnChain(
                  candidateKeyPairPublicKey,
                  vote
                );

                console.log("RESPONSE FROM VOTING FUNCTION", response);
              } catch (error) {
                console.warn("ERROR FROM VOTING FUNCTION", error);
              }
            }
          }
        } catch (err) {
          console.log("CATCH IN LOOP", err);
        }
      }
    } else {
      console.log("No voting allowed until next round");
    }
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
let connection;
const namespaceWrapper = new NamespaceWrapper();
namespaceWrapper.getRpcUrl().then((rpcUrl) => {
  connection = new Connection(rpcUrl, 'confirmed');
});
module.exports = {
  namespaceWrapper,
};
