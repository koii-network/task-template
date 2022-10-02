import axios,{AxiosResponse} from 'axios';
import { Connection, PublicKey } from '@_koi/web3.js';
import { GenericResponseInterface } from './interfaces/ResponseInterface';
import { TASK_ID, MAIN_ACCOUNT_PUBKEY, SECRET_KEY } from './init';

const BASE_ROOT_URL = 'http://localhost:8080/namespace-wrapper';

let connection;

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

  async submissionOnChain(
    taskStateInfoKeypairPubKey,
    submitterKeypair,
    submission,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'submissionOnChain',
      taskStateInfoKeypairPubKey,
      submitterKeypair,
      submission,
    );
  }
  async voteOnChain(
    taskStateInfoKeypairPubKey,
    submitterPubkey,
    voterKeypair,
    isValid,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'voteOnChain',
      taskStateInfoKeypairPubKey,
      submitterPubkey,
      voterKeypair,
      isValid,
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
    taskStateInfoAddress,
    stakePotAccount,
    beneficiaryAccount,
    claimerKeypair,
  ): Promise<GenericResponseInterface> {
    return await genericHandler(
      'claimReward',
      taskStateInfoAddress,
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
  async getSubmitterAccount(): Promise<GenericResponseInterface> {
    return await genericHandler('getSubmitterAccount');
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
  async checkVoteStatus(): Promise<GenericResponseInterface> {
    return await genericHandler('checkVoteStatus');
  }
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
}
async function genericHandler(...args): Promise<GenericResponseInterface> {
  try {
    const response: AxiosResponse = await axios.post(BASE_ROOT_URL, {
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
export const namespaceWrapper = new NamespaceWrapper();
namespaceWrapper.getRpcUrl().then((rpcUrl) => {
  connection = new Connection(rpcUrl as unknown as string, 'confirmed');
});
