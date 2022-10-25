import axios, { AxiosResponse } from 'axios';
import { Connection, Keypair, PublicKey } from '@_koi/web3.js';
import { GenericResponseInterface } from './interfaces/ResponseInterface';
import { TASK_ID, MAIN_ACCOUNT_PUBKEY, SECRET_KEY } from './init';

const BASE_ROOT_URL = 'http://localhost:8080/namespace-wrapper';
const TRUSTED_SERVICE_URL = 'https://k2-tasknet.koii.live';
let connection;
export interface INode {
  data: {
    url: string | undefined;
    timestamp: number;
  };
  signature: string;
  owner: string;
  submitterPubkey: string;
  tasks: [string];
  submission_value: string;
}
class NamespaceWrapper {
  /**
   * Namespace wrapper of storeGetAsync
   * @param {string} key // Path to get
   * @returns {Promise<*>} Promise containing data
   */
  async storeGet(key): Promise<string> {
    return (await genericHandler('storeGet', key)) as unknown as string | null;
  }
  /**
   * Namespace wrapper over storeSetAsync
   * @param {string} key Path to set
   * @param {*} value Data to set
   * @returns {Promise<void>}
   */
  async storeSet(key, value): Promise<void> {
    return (await genericHandler('storeSet', key, value)) as unknown as void;
  }
  /**
   * Namespace wrapper over fsPromises methods
   * @param {*} method The fsPromise method to call
   * @param {*} path Path for the express call
   * @param  {...any} args Remaining parameters for the FS call
   * @returns {Promise<any>}
   */
  async fs(method, path, ...args) {
    return await genericHandler('fs', method, path, ...args);
  }
  async fsStaking(method, path, ...args) {
    return await genericHandler('fsStaking', method, path, ...args);
  }
  async fsWriteStream(imagepath: string) {
    return await genericHandler('fsWriteStream', imagepath);
  }
  async fsReadStream(imagepath: string) {
    return await genericHandler('fsReadStream', imagepath);
  }

  async submissionOnChain(
    submitterKeypair,
    submission,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'submissionOnChain',
      submitterKeypair,
      submission,
    );
  }
  async voteOnChain(
    candidatePubkey,
    isValid,
    voterKeypair,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'voteOnChain',
      candidatePubkey,
      isValid,
      voterKeypair,
    );
  }
  async stakeOnChain(
    taskStateInfoPublicKey,
    stakingAccKeypair,
    stakePotAccount,
    stakeAmount,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'stakeOnChain',
      taskStateInfoPublicKey,
      stakingAccKeypair,
      stakePotAccount,
      stakeAmount,
    );
  }
  async claimReward(
    stakePotAccount,
    beneficiaryAccount,
    claimerKeypair,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'claimReward',
      stakePotAccount,
      beneficiaryAccount,
      claimerKeypair,
    );
  }
  async sendTransaction(
    serviceNodeAccount,
    beneficiaryAccount,
    amount,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'sendTransaction',
      serviceNodeAccount,
      beneficiaryAccount,
      amount,
    );
  }
  async getSubmitterAccount(): Promise<Keypair> {
    const submitterAccountResp = await genericHandler('getSubmitterAccount');
    return Keypair.fromSecretKey(
      Uint8Array.from(
        Object.values(submitterAccountResp?._keypair?.secretKey),
      ),
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
    signers,
  ): Promise<GenericResponseInterface> {
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
  async getTaskState(): Promise<GenericResponseInterface> {
    return await genericHandler('getTaskState');
  }
  // async checkVoteStatus(): Promise<GenericResponseInterface> {
  //   return await genericHandler('checkVoteStatus');
  // }
  async checkSubmissionAndUpdateRound(
    submissionValue = 'default',
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'checkSubmissionAndUpdateRound',
      submissionValue,
    );
  }
  async getProgramAccounts(): Promise<GenericResponseInterface> {
    return await genericHandler('getProgramAccounts');
  }
  async defaultTaskSetup(): Promise<GenericResponseInterface> {
    return await genericHandler('defaultTaskSetup');
  }
  async getRpcUrl(): Promise<GenericResponseInterface> {
    return await genericHandler('getRpcUrl');
  }
  async getNodes(url: string): Promise<GenericResponseInterface> {
    return await genericHandler('getNodes', url);
  }
  async validateAndVoteOnNodes(validate: (node: INode) => Promise<boolean>) {
    // await this.checkVoteStatus();
    console.log('******/  IN VOTING /******');
    const taskAccountDataJSON = await this.getTaskState();
    const current_round = taskAccountDataJSON.current_round;
    const expected_round = current_round - 1;

    const status = taskAccountDataJSON.status;
    const task_status = Object.keys(status)[0];

    // const voteStatus = await this.storeGet('voteStatus');
    const lastVotedRound = await this.storeGet('lastVotedRound');
    console.log(
      `Task status: ${task_status}, Last Voted Round: ${lastVotedRound}, Submissions: ${
        Object.keys(taskAccountDataJSON.submissions).length
      }`,
    );

    console.log('Submissions', taskAccountDataJSON.submissions);

    if (!TRUSTED_SERVICE_URL) console.warn('SERVICE_URL not set');
    const nodes = await this.getNodes(TRUSTED_SERVICE_URL);
    console.log('Nodes', nodes);

    if (
      lastVotedRound != expected_round.toString() &&
      task_status == 'Voting' &&
      Object.keys(taskAccountDataJSON.submissions).length > 0
    ) {
      // Filter only submissions from last round
      const submissions = {};
      for (const id in taskAccountDataJSON.submissions) {
        console.log(
          'round - expected',
          taskAccountDataJSON.submissions[id].round,
          expected_round,
        );
        if (taskAccountDataJSON.submissions[id].round == expected_round) {
          submissions[id] = taskAccountDataJSON.submissions[id];
        }
      }
      const values: any = Object.values(submissions);
      const keys = Object.keys(submissions);
      const size = values.length;
      console.log('Submissions from last round: ', size, submissions);

      for (let i = 0; i < size; i++) {
        // Fetch candidate public key
        const candidatePublicKey = keys[i];
        const candidateKeyPairPublicKey = new PublicKey(keys[i]);
        const submitterAccountKeyPair = await this.getSubmitterAccount();
        console.log({ submitterAccountKeyPair });
        console.log(submitterAccountKeyPair.publicKey);

        const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();
        if (candidatePublicKey == submitterPubkey) {
          console.log('YOU CANNOT VOTE ON YOUR OWN SUBMISSIONS');
        } else {
          // LOGIC for voting function
          const node = nodes.find((e) => e.submitterPubkey == keys[i]);
          const nodeData = node
            ? {
                url: node.data.url,
                ...values[i],
              }
            : values[i];
          const isValid = validate(nodeData);
          console.log(`Voting ${isValid} to ${candidatePublicKey}`);
          try {
            const response = await this.voteOnChain(
              candidateKeyPairPublicKey,
              isValid,
              submitterAccountKeyPair,
            );

            console.log('RESPONSE FROM VOTING FUNCTION', response);
          } catch (error) {
            console.warn('ERROR FROM VOTING FUNCTION', error);
          }
        }
      }

      // After every iteration of checking the Submissions the Voting will be closed for that round
      try {
        await this.storeSet('lastVotedRound', `${expected_round}`);
      } catch (err) {
        console.warn('Error setting voting status', err);
      }
    } else {
      console.log('No voting allowed until next round');
    }
  }
}
async function genericHandler(...args): Promise<GenericResponseInterface> {
  try {
    const response: AxiosResponse = await axios.post(BASE_ROOT_URL, {
      args,
      taskId: TASK_ID,
      secret: SECRET_KEY,
    });
    if (response.status == 200) return response.data?.response;
    else {
      console.error(response.status, response.data);
      return null;
    }
  } catch (err) {
    console.error(err.message);
    console.error(err?.response?.data);
    return null;
  }
}
export const namespaceWrapper = new NamespaceWrapper();
namespaceWrapper.getRpcUrl().then((rpcUrl) => {
  connection = new Connection(rpcUrl as unknown as string, 'confirmed');
});
