const { default: axios } = require('axios');
const { TASK_ID, SECRET_KEY, TASK_NODE_PORT } = require('./init');
const { Connection, PublicKey, Keypair } = require('@_koi/web3.js');
const taskNodeAdministered = !!TASK_ID;
const BASE_ROOT_URL = `http://localhost:${TASK_NODE_PORT}/namespace-wrapper`;
const Datastore = require('nedb-promises');
const fsPromises = require('fs/promises');
const bs58 = require('bs58');
const nacl = require('tweetnacl');

class NamespaceWrapper {
  #db;
  #testingMainSystemAccount;
  #testingStakingSystemAccount;
  #testingTaskState;
  #testingDistributionList;

  constructor() {
    if (taskNodeAdministered) {
      this.initializeDB();
    } else {
      this.#db = Datastore.create('./localKOIIDB.db');
      this.#testingDistributionList = {};
    }
  }

  async initializeDB() {
    if (this.#db) return;
    try {
      if (taskNodeAdministered) {
        const path = await this.getTaskLevelDBPath();
        this.#db = Datastore.create(path);
      } else {
        this.#db = Datastore.create('./localKOIIDB.db');
      }
    } catch (e) {
      this.#db = Datastore.create(`../namespace/${TASK_ID}/KOIILevelDB.db`);
    }
  }

  async getDb() {
    if (this.#db) return this.#db;
    await this.initializeDB();
    return this.#db;
  }
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   */
  async storeGet(key) {
    try {
      await this.initializeDB();
      const resp = await this.#db.findOne({ key: key });
      if (resp) {
        return resp[key];
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   */
  async storeSet(key, value) {
    try {
      await this.initializeDB();
      await this.#db.update(
        { key: key },
        { [key]: value, key },
        { upsert: true },
      );
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  /**
   * Namespace wrapper over fsPromises methods
   * @param {*} method The fsPromise method to call
   * @param {*} path Path for the express call
   * @param  {...any} args Remaining parameters for the FS call
   */
  async fs(method, path, ...args) {
    if (taskNodeAdministered) {
      return await genericHandler('fs', method, path, ...args);
    } else {
      return fsPromises[method](`${basePath}/${path}`, ...args);
    }
  }
  async fsStaking(method, path, ...args) {
    if (taskNodeAdministered) {
      return await genericHandler('fsStaking', method, path, ...args);
    } else {
      return fsPromises[method](`${basePath}/${path}`, ...args);
    }
  }

  async fsWriteStream(imagepath) {
    if (taskNodeAdministered) {
      return await genericHandler('fsWriteStream', imagepath);
    } else {
      const writer = createWriteStream(imagepath);
      return writer;
    }
  }
  async fsReadStream(imagepath) {
    if (taskNodeAdministered) {
      return await genericHandler('fsReadStream', imagepath);
    } else {
      const file = readFileSync(imagepath);
      return file;
    }
  }

  /**
   * Namespace wrapper for getting current slots
   */
  async getSlot() {
    if (taskNodeAdministered) {
      return await genericHandler('getCurrentSlot');
    } else {
      return 100;
    }
  }

  async payloadSigning(body) {
    if (taskNodeAdministered) {
      return await genericHandler('signData', body);
    } else {
      const msg = new TextEncoder().encode(JSON.stringify(data));
      const signedMessage = nacl.sign(msg, this.mainSystemAccount.secretKey);
      return await this.bs58Encode(signedMessage);
    }
  }

  async bs58Encode(data) {
    return bs58.encode(
      Buffer.from(data.buffer, data.byteOffset, data.byteLength),
    );
  }

  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} signedMessage r // Path to get
   */

  async verifySignature(signedMessage, pubKey) {
    if (taskNodeAdministered) {
      return await genericHandler('verifySignedData', signedMessage, pubKey);
    } else {
      try {
        const payload = nacl.sign.open(
          await this.bs58Decode(signedData),
          await this.bs58Decode(publicKey),
        );
        if (!payload) return { error: 'Invalid signature' };
        return { data: this.decodePayload(payload) };
      } catch (e) {
        console.error(e);
        return { error: `Verification failed: ${e}` };
      }
    }
  }

  // async submissionOnChain(submitterKeypair, submission) {
  //   return await genericHandler(
  //     'submissionOnChain',
  //     submitterKeypair,
  //     submission,
  //   );
  // }

  async stakeOnChain(
    taskStateInfoPublicKey,
    stakingAccKeypair,
    stakePotAccount,
    stakeAmount,
  ) {
    if (taskNodeAdministered) {
      return await genericHandler(
        'stakeOnChain',
        taskStateInfoPublicKey,
        stakingAccKeypair,
        stakePotAccount,
        stakeAmount,
      );
    } else {
      this.#testingTaskState.stake_list[
        this.#testingStakingSystemAccount.publicKey.toBase58()
      ] = stakeAmount;
    }
  }
  async claimReward(stakePotAccount, beneficiaryAccount, claimerKeypair) {
    if (!taskNodeAdministered)
      throw new Error('Cannot call sendTransaction in testing mode');
    return await genericHandler(
      'claimReward',
      stakePotAccount,
      beneficiaryAccount,
      claimerKeypair,
    );
  }
  async sendTransaction(serviceNodeAccount, beneficiaryAccount, amount) {
    if (!taskNodeAdministered)
      throw new Error('Cannot call sendTransaction in testing mode');
    return await genericHandler(
      'sendTransaction',
      serviceNodeAccount,
      beneficiaryAccount,
      amount,
    );
  }

  async getSubmitterAccount() {
    if (taskNodeAdministered) {
      const submitterAccountResp = await genericHandler('getSubmitterAccount');
      return Keypair.fromSecretKey(
        Uint8Array.from(Object.values(submitterAccountResp._keypair.secretKey)),
      );
    } else {
      return this.#testingStakingSystemAccount;
    }
  }

  /**
   * sendAndConfirmTransaction wrapper that injects mainSystemWallet as the first signer for paying the tx fees
   * @param {connection} method // Receive method ["get", "post", "put", "delete"]
   * @param {transaction} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  async sendAndConfirmTransactionWrapper(transaction, signers) {
    if (!taskNodeAdministered)
      throw new Error('Cannot call sendTransaction in testing mode');
    const blockhash = (await connection.getRecentBlockhash('finalized'))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(MAIN_ACCOUNT_PUBKEY);
    return await genericHandler(
      'sendAndConfirmTransactionWrapper',
      transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      }),
      signers,
    );
  }

  // async signArweave(transaction) {
  //   let tx = await genericHandler('signArweave', transaction.toJSON());
  //   return arweave.transactions.fromRaw(tx);
  // }
  // async signEth(transaction) {
  //   return await genericHandler('signEth', transaction);
  // }
  async getTaskState() {
    if (taskNodeAdministered) {
      const response = await genericHandler('getTaskState');
      if (response.error) {
        return null;
      }
      return response;
    } else {
      return this.#testingTaskState;
    }
  }

  async auditSubmission(candidatePubkey, isValid, voterKeypair, round) {
    if (taskNodeAdministered) {
      return await genericHandler(
        'auditSubmission',
        candidatePubkey,
        isValid,
        voterKeypair,
        round,
      );
    } else {
      this.#testingTaskState.submissions_audit_trigger[round] = {
        [candidatePubkey]: {
          trigger_by: this.#testingStakingSystemAccount.publicKey.toBase58(),
          slot: 100,
          votes: [],
        },
      };
    }
  }

  async distributionListAuditSubmission(
    candidatePubkey,
    isValid,
    voterKeypair,
    round,
  ) {
    if (taskNodeAdministered) {
      return await genericHandler(
        'distributionListAuditSubmission',
        candidatePubkey,
        isValid,
        round,
      );
    } else {
      this.#testingTaskState.distributions_audit_trigger[round] = {
        [candidatePubkey]: {
          trigger_by: this.#testingStakingSystemAccount.publicKey.toBase58(),
          slot: 100,
          votes: [],
        },
      };
    }
  }

  async getRound() {
    if (taskNodeAdministered) {
      return await genericHandler('getRound');
    } else {
      return 1;
    }
  }

  async nodeSelectionDistributionList() {
    if (taskNodeAdministered) {
      return await genericHandler('nodeSelectionDistributionList');
    } else {
      return this.#testingStakingSystemAccount.publicKey.toBase58();
    }
  }

  async payoutTrigger() {
    // TODO: Remaining
    return await genericHandler('payloadTrigger');
  }

  async uploadDistributionList(distributionList, round) {
    if (taskNodeAdministered) {
      return await genericHandler(
        'uploadDistributionList',
        distributionList,
        round,
      );
    } else {
      if (!this.#testingDistributionList[round])
        this.#testingDistributionList[round] = {};

      this.#testingDistributionList[round][
        this.#testingStakingSystemAccount.toBase58()
      ] = Buffer.from(distributionList.toString());
    }
  }

  async distributionListSubmissionOnChain(round) {
    if (taskNodeAdministered) {
      return await genericHandler('distributionListSubmissionOnChain', round);
    } else {
      if (!this.#testingTaskState.distribution_rewards_submission[round])
        this.#testingTaskState.distribution_rewards_submission[round] = {};

      this.#testingDistributionList[round][
        this.#testingStakingSystemAccount.toBase58()
      ] = {
        submissionValue: this.#testingStakingSystemAccount.toBase58(),
        slot: 200,
        round: 1,
      };
    }
  }

  async checkSubmissionAndUpdateRound(submissionValue = 'default', round) {
    return await genericHandler(
      'checkSubmissionAndUpdateRound',
      submissionValue,
      round,
    );
  }
  async getProgramAccounts() {
    if (taskNodeAdministered) {
      return await genericHandler('getProgramAccounts');
    } else {
      console.log('Cannot call getProgramAccounts in testing mode');
    }
  }
  async defaultTaskSetup() {
    if (taskNodeAdministered) {
      return await genericHandler('defaultTaskSetup');
    } else {
      this.#testingMainSystemAccount = new Keypair();
      this.#testingStakingSystemAccount = new Keypair();
      initTestingTaskState();
    }
  }
  async getRpcUrl() {
    if (taskNodeAdministered) {
      return await genericHandler('getRpcUrl');
    } else {
      console.log('Cannot call getNodes in testing mode');
    }
  }
  async getNodes(url) {
    if (taskNodeAdministered) {
      return await genericHandler('getNodes', url);
    } else {
      console.log('Cannot call getNodes in testing mode');
    }
  }

  // Wrapper for selection of node to prepare a distribution list

  async nodeSelectionDistributionList(round) {
    return await genericHandler('nodeSelectionDistributionList', round);
  }

  async getDistributionList(publicKey, round) {
    const response = await genericHandler(
      'getDistributionList',
      publicKey,
      round,
    );
    if (response.error) {
      return null;
    }
    return response;
  }

  async validateAndVoteOnNodes(validate, round) {
    console.log('******/  IN VOTING /******');
    const taskAccountDataJSON = await this.getTaskState();

    console.log(
      'Fetching the submissions of N - 1 round',
      taskAccountDataJSON.submissions[round],
    );
    const submissions = taskAccountDataJSON.submissions[round];
    if (submissions == null) {
      console.log('No submisssions found in N-1 round');
      return 'No submisssions found in N-1 round';
    } else {
      const keys = Object.keys(submissions);
      const values = Object.values(submissions);
      const size = values.length;
      console.log('Submissions from last round: ', keys, values, size);
      let isValid;
      const submitterAccountKeyPair = await this.getSubmitterAccount();
      const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();
      for (let i = 0; i < size; i++) {
        let candidatePublicKey = keys[i];
        console.log('FOR CANDIDATE KEY', candidatePublicKey);
        let candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == submitterPubkey) {
          console.log('YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS');
        } else {
          try {
            console.log(
              'SUBMISSION VALUE TO CHECK',
              values[i].submission_value,
            );
            isValid = await validate(values[i].submission_value, round);
            console.log(`Voting ${isValid} to ${candidatePublicKey}`);

            if (isValid) {
              // check for the submissions_audit_trigger , if it exists then vote true on that otherwise do nothing
              const submissions_audit_trigger =
                taskAccountDataJSON.submissions_audit_trigger[round];
              console.log('SUBMIT AUDIT TRIGGER', submissions_audit_trigger);
              // console.log(
              //   "CANDIDATE PUBKEY CHECK IN AUDIT TRIGGER",
              //   submissions_audit_trigger[candidatePublicKey]
              // );
              if (
                submissions_audit_trigger &&
                submissions_audit_trigger[candidatePublicKey]
              ) {
                console.log('VOTING TRUE ON AUDIT');
                const response = await this.auditSubmission(
                  candidateKeyPairPublicKey,
                  isValid,
                  submitterAccountKeyPair,
                  round,
                );
                console.log('RESPONSE FROM AUDIT FUNCTION', response);
              }
            } else if (isValid == false) {
              // Call auditSubmission function and isValid is passed as false
              console.log('RAISING AUDIT / VOTING FALSE');
              const response = await this.auditSubmission(
                candidateKeyPairPublicKey,
                isValid,
                submitterAccountKeyPair,
                round,
              );
              console.log('RESPONSE FROM AUDIT FUNCTION', response);
            }
          } catch (err) {
            console.log('ERROR IN ELSE CONDITION', err);
          }
        }
      }
    }
  }

  async validateAndVoteOnDistributionList(validateDistribution, round) {
    // await this.checkVoteStatus();
    console.log('******/  IN VOTING OF DISTRIBUTION LIST /******');
    const taskAccountDataJSON = await this.getTaskState();
    console.log(
      'Fetching the Distribution submissions of N - 2 round',
      taskAccountDataJSON.distribution_rewards_submission[round],
    );
    const submissions =
      taskAccountDataJSON.distribution_rewards_submission[round];
    if (submissions == null) {
      console.log('No submisssions found in N-2 round');
      return 'No submisssions found in N-2 round';
    } else {
      const keys = Object.keys(submissions);
      const values = Object.values(submissions);
      const size = values.length;
      console.log(
        'Distribution Submissions from last round: ',
        keys,
        values,
        size,
      );
      let isValid;
      const submitterAccountKeyPair = await this.getSubmitterAccount();
      const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();

      for (let i = 0; i < size; i++) {
        let candidatePublicKey = keys[i];
        console.log('FOR CANDIDATE KEY', candidatePublicKey);
        let candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == submitterPubkey) {
          console.log('YOU CANNOT VOTE ON YOUR OWN DISTRIBUTION SUBMISSIONS');
        } else {
          try {
            console.log(
              'DISTRIBUTION SUBMISSION VALUE TO CHECK',
              values[i].submission_value,
            );
            isValid = await validateDistribution(
              values[i].submission_value,
              round,
            );
            console.log(`Voting ${isValid} to ${candidatePublicKey}`);

            if (isValid) {
              // check for the submissions_audit_trigger , if it exists then vote true on that otherwise do nothing
              const distributions_audit_trigger =
                taskAccountDataJSON.distributions_audit_trigger[round];
              console.log(
                'SUBMIT DISTRIBUTION AUDIT TRIGGER',
                distributions_audit_trigger,
              );
              // console.log(
              //   "CANDIDATE PUBKEY CHECK IN AUDIT TRIGGER",
              //   distributions_audit_trigger[candidatePublicKey]
              // );
              if (
                distributions_audit_trigger &&
                distributions_audit_trigger[candidatePublicKey]
              ) {
                console.log('VOTING TRUE ON DISTRIBUTION AUDIT');
                const response = await this.distributionListAuditSubmission(
                  candidateKeyPairPublicKey,
                  isValid,
                  submitterAccountKeyPair,
                  round,
                );
                console.log(
                  'RESPONSE FROM DISTRIBUTION AUDIT FUNCTION',
                  response,
                );
              }
            } else if (isValid == false) {
              // Call auditSubmission function and isValid is passed as false
              console.log('RAISING AUDIT / VOTING FALSE ON DISTRIBUTION');
              const response = await this.distributionListAuditSubmission(
                candidateKeyPairPublicKey,
                isValid,
                submitterAccountKeyPair,
                round,
              );
              console.log(
                'RESPONSE FROM DISTRIBUTION AUDIT FUNCTION',
                response,
              );
            }
          } catch (err) {
            console.log('ERROR IN ELSE CONDITION FOR DISTRIBUTION', err);
          }
        }
      }
    }
  }
  async getTaskLevelDBPath() {
    return await genericHandler('getTaskLevelDBPath');
  }
  initTestingTaskState() {
    this.#testingTaskState = {
      task_name: 'DummyTestState',
      task_description: 'Dummy Task state for testing flow',
      submissions: {},
      submissions_audit_trigger: {},
      total_bounty_amount: 10000000000,
      bounty_amount_per_round: 1000000000,
      total_stake_amount: 50000000000,
      minimum_stake_amount: 5000000000,
      available_balances: {},
      stake_list: {},
      round_time: 600,
      starting_slot: 0,
      audit_window: 200,
      submission_window: 200,
      distribution_rewards_submission: {},
      distributions_audit_trigger: {},
    };
  }
}

async function genericHandler(...args) {
  try {
    let response = await axios.post(BASE_ROOT_URL, {
      args,
      taskId: TASK_ID,
      secret: SECRET_KEY,
    });
    if (response.status == 200) return response.data.response;
    else {
      console.error(response.status, response.data);
      return null;
    }
  } catch (err) {
    console.error(`Error in genericHandler: "${args[0]}"`, err.message);
    console.error(err?.response?.data);
    return { error: err };
  }
}
let connection;
const namespaceWrapper = new NamespaceWrapper();
if (taskNodeAdministered) {
  namespaceWrapper.getRpcUrl().then(rpcUrl => {
    console.log(rpcUrl, 'RPC URL');
    connection = new Connection(rpcUrl, 'confirmed');
  });
}
module.exports = {
  namespaceWrapper,
  taskNodeAdministered,
};
