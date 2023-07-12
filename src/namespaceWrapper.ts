import axios from "axios";
import { Connection, Keypair, PublicKey } from "@_koi/web3.js";
import { GenericResponseInterface } from "./interfaces/ResponseInterface";
import {
  TASK_ID,
  MAIN_ACCOUNT_PUBKEY,
  SECRET_KEY,
  TASK_NODE_PORT,
} from "./init";
import Datastore = require("nedb-promises");
import * as fsPromises from "fs/promises";
import { createWriteStream, readFileSync } from "fs";
import { TextDecoder, TextEncoder } from "util";
const BASE_ROOT_URL = `http://localhost:${TASK_NODE_PORT}/namespace-wrapper`;
export const taskNodeAdministered = !!TASK_ID;

import bs58 from "bs58";
import nacl from "tweetnacl";

//const TRUSTED_SERVICE_URL = "https://k2-tasknet.koii.live";
let connection;
// export interface INode {
//   data: {
//     url: string | undefined;
//     timestamp: number;
//   };
//   signature: string;
//   owner: string;
//   submitterPubkey: string;
//   tasks: [string];
//   submission_value: string;
// }
class NamespaceWrapper {
  #db: any;
  #testingMainSystemAccount;
  #testingStakingSystemAccount;
  #testingTaskState;
  #testingDistributionList;
  constructor() {
    if (taskNodeAdministered) {
      this.initializeDB();
    } else {
      this.#db = Datastore.create("./localKOIIDB.db");
      this.defaultTaskSetup();
    }
  }

  async initializeDB() {
    if (this.#db) return;
    try {
      if (taskNodeAdministered) {
        const path = await this.getTaskLevelDBPath();
        this.#db = Datastore.create(path);
      } else {
        this.#db = Datastore.create("./localKOIIDB.db");
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
   * @returns {Promise<*>} Promise containing data
   */
  async storeGet(key: string): Promise<string | null> {
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
   * @returns {Promise<void>}
   */
  async storeSet(key: string, value: string): Promise<void> {
    try {
      await this.initializeDB();
      await this.#db.update(
        { key: key },
        { [key]: value, key },
        { upsert: true }
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
   * @returns {Promise<any>}
   */
  async fs(method, path, ...args) {
    if (taskNodeAdministered) {
      return await genericHandler("fs", method, path, ...args);
    } else {
      return fsPromises[method](`${path}`, ...args);
    }
  }
  async fsStaking(method, path, ...args) {
    if (taskNodeAdministered) {
      return await genericHandler("fsStaking", method, path, ...args);
    } else {
      return fsPromises[method](`${path}`, ...args);
    }
  }
  async fsWriteStream(imagepath: string) {
    if (taskNodeAdministered) {
      return await genericHandler("fsWriteStream", imagepath);
    } else {
      const writer = createWriteStream(imagepath);
      return writer;
    }
  }
  async fsReadStream(imagepath: string) {
    if (taskNodeAdministered) {
      return await genericHandler("fsReadStream", imagepath);
    } else {
      const file = readFileSync(imagepath);
      return file;
    }
  }
  async getSlot() {
    if (taskNodeAdministered) {
      return await genericHandler("getCurrentSlot");
    } else {
      return 100;
    }
  }

  async getRound() {
    if (taskNodeAdministered) {
      return await genericHandler("getRound");
    } else {
      return 1;
    }
  }

  async nodeSelectionDistributionList() {
    if (taskNodeAdministered) {
      return await genericHandler("nodeSelectionDistributionList");
    } else {
      return this.#testingStakingSystemAccount.publicKey.toBase58();
    }
  }

  async payloadSigning(body) {
    if (taskNodeAdministered) {
      return await genericHandler("signData", body);
    } else {
      const msg = new TextEncoder().encode(JSON.stringify(body));
      const signedMessage = nacl.sign(
        msg,
        this.#testingMainSystemAccount.secretKey
      );
      return await this.bs58Encode(signedMessage);
    }
  }

  async bs58Encode(data) {
    return bs58.encode(
      Buffer.from(data.buffer, data.byteOffset, data.byteLength)
    );
  }

  async bs58Decode(data) {
    return new Uint8Array(bs58.decode(data));
  }

  decodePayload(payload) {
    return new TextDecoder().decode(payload);
  }

  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} signedMessage r // Path to get
   */

  async verifySignature(signedMessage, pubKey) {
    if (taskNodeAdministered) {
      return await genericHandler("verifySignedData", signedMessage, pubKey);
    } else {
      try {
        const payload = nacl.sign.open(
          await this.bs58Decode(signedMessage),
          await this.bs58Decode(pubKey)
        );
        if (!payload) return { error: "Invalid signature" };
        return { data: this.decodePayload(payload) };
      } catch (e) {
        console.error(e);
        return { error: `Verification failed: ${e}` };
      }
    }
  }

  // async submissionOnChain(
  //   submitterKeypair: Keypair,
  //   submission: string
  // ): Promise<GenericResponseInterface> {
  //   return await genericHandler(
  //     "submissionOnChain",
  //     submitterKeypair,
  //     submission
  //   );
  // }
  async auditSubmission(
    candidatePubkey: PublicKey,
    isValid: boolean,
    voterKeypair: Keypair,
    round: number
  ): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      return await genericHandler(
        "auditSubmission",
        candidatePubkey,
        isValid,
        voterKeypair,
        round
      );
    } else {
      if (
        this.#testingTaskState.submissions_audit_trigger[round] &&
        this.#testingTaskState.submissions_audit_trigger[round][
          candidatePubkey.toString()
        ]
      ) {
        this.#testingTaskState.submissions_audit_trigger[round][
          candidatePubkey.toString()
        ].votes.push({
          is_valid: isValid,
          voter: voterKeypair.publicKey.toBase58(),
          slot: 100,
        });
      } else {
        this.#testingTaskState.submissions_audit_trigger[round] = {
          [candidatePubkey.toString()]: {
            trigger_by: this.#testingStakingSystemAccount.publicKey.toBase58(),
            slot: 100,
            votes: [],
          },
        };
      }
      return Promise.resolve({});
    }
  }

  async distributionListAuditSubmission(
    candidatePubkey: PublicKey,
    isValid: boolean,
    voterKeypair: Keypair,
    round: number
  ): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      return await genericHandler(
        "distributionListAuditSubmission",
        candidatePubkey,
        isValid,
        round
      );
    } else {
      if (
        this.#testingTaskState.distributions_audit_trigger[round] &&
        this.#testingTaskState.distributions_audit_trigger[round][
          candidatePubkey.toString()
        ]
      ) {
        this.#testingTaskState.distributions_audit_trigger[round][
          candidatePubkey.toString()
        ].votes.push({
          is_valid: isValid,
          voter: voterKeypair.publicKey.toBase58(),
          slot: 100,
        });
      } else {
        this.#testingTaskState.distributions_audit_trigger[round] = {
          [candidatePubkey.toString()]: {
            trigger_by: this.#testingStakingSystemAccount.publicKey.toBase58(),
            slot: 100,
            votes: [],
          },
        };
      }
      return Promise.resolve({});
    }
  }

  async uploadDistributionList(distributionList, round: number) {
    if (taskNodeAdministered) {
      return await genericHandler(
        "uploadDistributionList",
        distributionList,
        round
      );
    } else {
      if (!this.#testingDistributionList[round])
        this.#testingDistributionList[round] = {};

      this.#testingDistributionList[round][
        this.#testingStakingSystemAccount.publicKey.toBase58()
      ] = Buffer.from(JSON.stringify(distributionList));
      return true;
    }
  }

  async distributionListSubmissionOnChain(round: number) {
    if (taskNodeAdministered) {
      return await genericHandler("distributionListSubmissionOnChain", round);
    } else {
      if (!this.#testingTaskState.distribution_rewards_submission[round])
        this.#testingTaskState.distribution_rewards_submission[round] = {};

      this.#testingTaskState.distribution_rewards_submission[round][
        this.#testingStakingSystemAccount.publicKey.toBase58()
      ] = {
        submission_value:
          this.#testingStakingSystemAccount.publicKey.toBase58(),
        slot: 200,
        round: 1,
      };
      return Promise.resolve({});
    }
  }

  async payoutTrigger() {
    if (taskNodeAdministered) {
      return await genericHandler("payloadTrigger");
    } else {
      console.log(
        "Payout Trigger only handles possitive flows (Without audits)"
      );
      const round = 1;
      const submissionValAcc =
        this.#testingDistributionList[round][
          this.#testingStakingSystemAccount.toBase58()
        ].submission_value;
      this.#testingTaskState.available_balances =
        this.#testingDistributionList[round][submissionValAcc];
      return Promise.resolve({});
    }
  }

  async stakeOnChain(
    taskStateInfoPublicKey: PublicKey,
    stakingAccKeypair: Keypair,
    stakePotAccount: PublicKey,
    stakeAmount: number
  ): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      return await genericHandler(
        "stakeOnChain",
        taskStateInfoPublicKey,
        stakingAccKeypair,
        stakePotAccount,
        stakeAmount
      );
    } else {
      this.#testingTaskState.stake_list[
        this.#testingStakingSystemAccount.publicKey.toBase58()
      ] = stakeAmount;
      return Promise.resolve({
        success: true,
        message: "Stake on chain successful",
      });
    }
  }
  async claimReward(
    stakePotAccount: PublicKey,
    beneficiaryAccount: PublicKey,
    claimerKeypair: Keypair
  ): Promise<GenericResponseInterface> {
    if (!taskNodeAdministered) {
      console.log("Cannot call sendTransaction in testing mode");
      return Promise.resolve({
        success: false,
        message: "Cannot call sendTransaction in testing mode",
      });
    }
    return await genericHandler(
      "claimReward",
      stakePotAccount,
      beneficiaryAccount,
      claimerKeypair
    );
  }
  async sendTransaction(
    serviceNodeAccount: PublicKey,
    beneficiaryAccount: PublicKey,
    amount: number
  ): Promise<GenericResponseInterface> {
    if (!taskNodeAdministered) {
      console.log("Cannot call sendTransaction in testing mode");
      return Promise.resolve({
        success: false,
        message: "Cannot call sendTransaction in testing mode",
      });
    }
    return await genericHandler(
      "sendTransaction",
      serviceNodeAccount,
      beneficiaryAccount,
      amount
    );
  }
  async getSubmitterAccount(): Promise<Keypair> {
    if (taskNodeAdministered) {
      const submitterAccountResp = await genericHandler("getSubmitterAccount");
      return Keypair.fromSecretKey(
        Uint8Array.from(Object.values(submitterAccountResp._keypair.secretKey))
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
  async sendAndConfirmTransactionWrapper(
    transaction: any,
    signers: any
  ): Promise<GenericResponseInterface> {
    if (!taskNodeAdministered) {
      console.log("Cannot call sendTransaction in testing mode");
      return Promise.resolve({
        success: false,
        message: "Cannot call sendTransaction in testing mode",
      });
    }
    const blockhash = (await connection.getRecentBlockhash("finalized"))
      .blockhash;
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(MAIN_ACCOUNT_PUBKEY);
    return await genericHandler(
      "sendAndConfirmTransactionWrapper",
      transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      }),
      signers
    );
  }
  async getTaskState(): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      const response = await genericHandler("getTaskState");
      if (response.error) {
        return null;
      }
      return response;
    } else {
      return this.#testingTaskState;
    }
  }
  // async checkVoteStatus(): Promise<GenericResponseInterface> {
  //   return await genericHandler('checkVoteStatus');
  // }

  async checkSubmissionAndUpdateRound(
    submissionValue = "default",
    round: number
  ) {
    if (taskNodeAdministered) {
      return await genericHandler(
        "checkSubmissionAndUpdateRound",
        submissionValue,
        round
      );
    } else {
      if (!this.#testingTaskState.submissions[round])
        this.#testingTaskState.submissions[round] = {};
      this.#testingTaskState.submissions[round][
        this.#testingStakingSystemAccount.publicKey.toBase58()
      ] = {
        submission_value: submissionValue,
        slot: 100,
        round: 1,
      };

      return Promise.resolve({});
    }
  }
  async getProgramAccounts(): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      return await genericHandler("getProgramAccounts");
    } else {
      console.log("Cannot call getProgramAccounts in testing mode");
      return Promise.resolve({
        success: false,
        message: "Cannot call sendTransaction in testing mode",
      });
    }
  }
  async defaultTaskSetup() {
    if (taskNodeAdministered) {
      return await genericHandler("defaultTaskSetup");
    } else {
      if (this.#testingTaskState) return Promise.resolve();
      this.#testingMainSystemAccount = new Keypair();
      this.#testingStakingSystemAccount = new Keypair();
      this.#testingDistributionList = {};
      this.#testingTaskState = {
        task_name: "DummyTestState",
        task_description: "Dummy Task state for testing flow",
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
  async getRpcUrl(): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      return await genericHandler("getRpcUrl");
    } else {
      console.log("Cannot call getNodes in testing mode");
      return Promise.resolve({
        success: false,
        message: "Cannot call getNodes in testing mode",
      });
    }
  }
  async getNodes(url: string): Promise<GenericResponseInterface> {
    if (taskNodeAdministered) {
      return await genericHandler("getNodes", url);
    } else {
      console.log("Cannot call getNodes in testing mode");
      return Promise.resolve({
        success: false,
        message: "Cannot call getNodes in testing mode",
      });
    }
  }

  async getDistributionList(publicKey: any, round: number) {
    if (taskNodeAdministered) {
      const response = await genericHandler(
        "getDistributionList",
        publicKey,
        round
      );
      if (response.error) {
        return null;
      }
      return response;
    } else {
      const submissionValAcc =
        this.#testingTaskState.distribution_rewards_submission[round][
          this.#testingStakingSystemAccount.publicKey.toBase58()
        ].submission_value;
      return this.#testingDistributionList[round][submissionValAcc];
    }
  }

  async validateAndVoteOnNodes(validateNode: any, round: number): Promise<any> {
    console.log("******/  IN VOTING /******");
    const taskAccountDataJSON = await this.getTaskState();

    console.log(
      "Fetching the submissions of N - 1 round",
      taskAccountDataJSON.submissions[round]
    );
    const submissions = taskAccountDataJSON.submissions[round];
    if (submissions == null) {
      console.log("No submisssions found in N-1 round");
      return "No submisssions found in N-1 round";
    } else {
      const keys = Object.keys(submissions);
      const values: any = Object.values(submissions);
      const size = values.length;
      console.log("Submissions from last round: ", keys, values, size);
      let isValid: boolean;
      const submitterAccountKeyPair = await this.getSubmitterAccount();
      const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();
      for (let i = 0; i < size; i++) {
        const candidatePublicKey = keys[i];
        console.log("FOR CANDIDATE KEY", candidatePublicKey);
        const candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == submitterPubkey) {
          console.log("YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS");
        } else {
          try {
            console.log(
              "SUBMISSION VALUE TO CHECK",
              values[i].submission_value
            );
            isValid = await validateNode(values[i].submission_value, round);
            console.log(`Voting ${isValid} to ${candidatePublicKey}`);

            if (isValid) {
              // check for the submissions_audit_trigger , if it exists then vote true on that otherwise do nothing
              const submissions_audit_trigger =
                taskAccountDataJSON.submissions_audit_trigger[round];
              console.log("SUBMIT AUDIT TRIGGER", submissions_audit_trigger);
              // console.log(
              //   "CANDIDATE PUBKEY CHECK IN AUDIT TRIGGER",
              //   submissions_audit_trigger[candidatePublicKey]
              // );
              if (
                submissions_audit_trigger &&
                submissions_audit_trigger[candidatePublicKey]
              ) {
                console.log("VOTING TRUE ON AUDIT");
                const response = await this.auditSubmission(
                  candidateKeyPairPublicKey,
                  isValid,
                  submitterAccountKeyPair,
                  round
                );
                console.log("RESPONSE FROM AUDIT FUNCTION", response);
              }
            } else if (isValid == false) {
              // Call auditSubmission function and isValid is passed as false
              console.log("RAISING AUDIT / VOTING FALSE");
              const response = await this.auditSubmission(
                candidateKeyPairPublicKey,
                isValid,
                submitterAccountKeyPair,
                round
              );
              console.log("RESPONSE FROM AUDIT FUNCTION", response);
            }
          } catch (err) {
            console.log("ERROR IN ELSE CONDITION", err);
          }
        }
      }
    }
  }

  async validateAndVoteOnDistributionList(
    validateDistribution: any,
    round: number
  ): Promise<any> {
    // await this.checkVoteStatus();
    console.log("******/  IN VOTING OF DISTRIBUTION LIST /******");
    const taskAccountDataJSON = await this.getTaskState();
    console.log(
      "Fetching the Distribution submissions of N - 2 round",
      taskAccountDataJSON.distribution_rewards_submission[round]
    );
    const submissions =
      taskAccountDataJSON.distribution_rewards_submission[round];
    if (submissions == null) {
      console.log("No submisssions found in N-2 round");
      return "No submisssions found in N-2 round";
    } else {
      const keys = Object.keys(submissions);
      const values: any = Object.values(submissions);
      const size = values.length;
      console.log("Submissions from last round: ", keys, values, size);
      let isValid: boolean;
      const submitterAccountKeyPair = await this.getSubmitterAccount();
      const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();

      for (let i = 0; i < size; i++) {
        const candidatePublicKey = keys[i];
        console.log("FOR CANDIDATE KEY", candidatePublicKey);
        const candidateKeyPairPublicKey = new PublicKey(keys[i]);
        if (candidatePublicKey == submitterPubkey) {
          console.log("YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS");
        } else {
          try {
            console.log(
              "SUBMISSION VALUE TO CHECK",
              values[i].submission_value
            );
            isValid = await validateDistribution(
              values[i].submission_value,
              round
            );
            console.log(`Voting ${isValid} to ${candidatePublicKey}`);

            if (isValid) {
              // check for the submissions_audit_trigger , if it exists then vote true on that otherwise do nothing
              const distributions_audit_trigger =
                taskAccountDataJSON.distributions_audit_trigger[round];
              console.log("SUBMIT AUDIT TRIGGER", distributions_audit_trigger);
              // console.log(
              //   "CANDIDATE PUBKEY CHECK IN AUDIT TRIGGER",
              //   distributions_audit_trigger[candidatePublicKey]
              // );
              if (
                distributions_audit_trigger &&
                distributions_audit_trigger[candidatePublicKey]
              ) {
                console.log("VOTING TRUE ON AUDIT");
                const response = await this.distributionListAuditSubmission(
                  candidateKeyPairPublicKey,
                  isValid,
                  submitterAccountKeyPair,
                  round
                );
                console.log("RESPONSE FROM AUDIT FUNCTION", response);
              }
            } else if (isValid == false) {
              // Call auditSubmission function and isValid is passed as false
              console.log("RAISING AUDIT / VOTING FALSE");
              const response = await this.distributionListAuditSubmission(
                candidateKeyPairPublicKey,
                isValid,
                submitterAccountKeyPair,
                round
              );
              console.log("RESPONSE FROM AUDIT FUNCTION", response);
            }
          } catch (err) {
            console.log("ERROR IN ELSE CONDITION", err);
          }
        }
      }
    }
  }

  async getTaskLevelDBPath() {
    if (taskNodeAdministered) {
      return await genericHandler("getTaskLevelDBPath");
    } else {
      return "./KOIIDB";
    }
  }
  async getBasePath() {
    if (taskNodeAdministered) {
      const basePath = (await namespaceWrapper.getTaskLevelDBPath()).replace(
        "/KOIIDB",
        ""
      );
      return basePath;
    } else {
      return "./";
    }
  }

  getMainAccountPubkey() {
    if (taskNodeAdministered) {
      return MAIN_ACCOUNT_PUBKEY;
    } else {
      return this.#testingMainSystemAccount.publicKey.toBase58();
    }
  }
}

async function genericHandler(...args) {
  try {
    const response = await axios.post(BASE_ROOT_URL, {
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
export const namespaceWrapper = new NamespaceWrapper();

if (taskNodeAdministered) {
  namespaceWrapper.getRpcUrl().then((rpcUrl) => {
    connection = new Connection(rpcUrl as unknown as string, "confirmed");
  });
}
