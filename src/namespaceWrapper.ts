import axios from "axios";
import { Connection, Keypair, PublicKey } from "@_koi/web3.js";
import { GenericResponseInterface } from "./interfaces/ResponseInterface";
import { TASK_ID, MAIN_ACCOUNT_PUBKEY, SECRET_KEY } from "./init";

const BASE_ROOT_URL = "http://localhost:8080/namespace-wrapper";
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
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  async storeGet(key): Promise<string> {
    return (await genericHandler("storeGet", key)) as unknown as string | null;
  }
  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   * @returns {Promise<void>}
   */
  async storeSet(key, value): Promise<void> {
    return (await genericHandler("storeSet", key, value)) as unknown as void;
  }
  /**
   * Namespace wrapper over fsPromises methods
   * @param {*} method The fsPromise method to call
   * @param {*} path Path for the express call
   * @param  {...any} args Remaining parameters for the FS call
   * @returns {Promise<any>}
   */
  async fs(method, path, ...args) {
    return await genericHandler("fs", method, path, ...args);
  }
  async fsStaking(method, path, ...args) {
    return await genericHandler("fsStaking", method, path, ...args);
  }
  async fsWriteStream(imagepath: string) {
    return await genericHandler("fsWriteStream", imagepath);
  }
  async fsReadStream(imagepath: string) {
    return await genericHandler("fsReadStream", imagepath);
  }
  async getSlot() {
    return await genericHandler("getCurrentSlot");
  }

  async submissionOnChain(
    submitterKeypair: Keypair,
    submission: string
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      "submissionOnChain",
      submitterKeypair,
      submission
    );
  }
  async auditSubmission(
    candidatePubkey: string,
    isValid: boolean,
    voterKeypair: Keypair,
    round: number
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      "voteOnChain",
      candidatePubkey,
      isValid,
      voterKeypair,
      round
    );
  }

  async distributionListAuditSubmission(
    candidatePubkey,
    isValid,
    voterKeypair,
    round
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      "distributionListAuditSubmission",
      candidatePubkey,
      isValid,
      voterKeypair,
      round
    );
  }

  async uploadDistributionList(distributionList, round) {
    return await genericHandler(
      "uploadDistributionList",
      distributionList,
      round
    );
  }

  async distributionListSubmissionOnChain(round) {
    return await genericHandler("distributionListSubmissionOnChain", round);
  }

  async payOutTrigger() {
    return await genericHandler("payloadTrigger");
  }

  async stakeOnChain(
    taskStateInfoPublicKey,
    stakingAccKeypair,
    stakePotAccount,
    stakeAmount
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      "stakeOnChain",
      taskStateInfoPublicKey,
      stakingAccKeypair,
      stakePotAccount,
      stakeAmount
    );
  }
  async claimReward(
    stakePotAccount,
    beneficiaryAccount,
    claimerKeypair
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      "claimReward",
      stakePotAccount,
      beneficiaryAccount,
      claimerKeypair
    );
  }
  async sendTransaction(
    serviceNodeAccount,
    beneficiaryAccount,
    amount
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      "sendTransaction",
      serviceNodeAccount,
      beneficiaryAccount,
      amount
    );
  }
  async getSubmitterAccount(): Promise<Keypair> {
    const submitterAccountResp = await genericHandler("getSubmitterAccount");
    return Keypair.fromSecretKey(
      Uint8Array.from(Object.values(submitterAccountResp._keypair.secretKey))
    );
  }
  /**
   * sendAndConfirmTransaction wrapper that injects mainSystemWallet as the first signer for paying the tx fees
   * @param {connection} method // Receive method ["get", "post", "put", "delete"]
   * @param {transaction} path // Endpoint path appended to namespace
   * @param {Function} callback // Callback function on traffic receive
   */
  async sendAndConfirmTransactionWrapper(
    transaction,
    signers
  ): Promise<GenericResponseInterface> {
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
    return await genericHandler("getTaskState");
  }
  // async checkVoteStatus(): Promise<GenericResponseInterface> {
  //   return await genericHandler('checkVoteStatus');
  // }

  async checkSubmissionAndUpdateRound(submissionValue, round) {
    return await genericHandler(
      "checkSubmissionAndUpdateRound",
      submissionValue,
      round
    );
  }
  async getProgramAccounts(): Promise<GenericResponseInterface> {
    return await genericHandler("getProgramAccounts");
  }
  async defaultTaskSetup(): Promise<GenericResponseInterface> {
    return await genericHandler("defaultTaskSetup");
  }
  async getRpcUrl(): Promise<GenericResponseInterface> {
    return await genericHandler("getRpcUrl");
  }
  async getNodes(url: string): Promise<GenericResponseInterface> {
    return await genericHandler("getNodes", url);
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
      let isValid;
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
            isValid = await validateNode(values[i].submission_value);
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
                  candidateKeyPairPublicKey.toBase58(),
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
                candidateKeyPairPublicKey.toBase58(),
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
      let isValid;
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
            isValid = await validateDistribution(values[i].submission_value);
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
}
async function genericHandler(...args): Promise<GenericResponseInterface> {
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
    console.log("Error in genericHandler", err);
    console.error(err.message);
    console.error(err?.response?.data);
    return null;
  }
}
export const namespaceWrapper = new NamespaceWrapper();
namespaceWrapper.getRpcUrl().then((rpcUrl) => {
  connection = new Connection(rpcUrl as unknown as string, "confirmed");
});
