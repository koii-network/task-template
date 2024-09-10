import 'dotenv/config';
import os from 'os';
import path from 'path';
import { Connection, PublicKey } from '@_koii/web3.js';
import { borsh_bpf_js_deserialize } from './wasm/bincode_js.cjs';

class Debugger {
  /*
  Create .env file with following variables or direclty input values to be used in live-debugging mode.
  */
  static taskID =
    process.env.TASK_ID || 'AK2P1L8NWGwWarbHeM7tX2mr4hJA7ZVXGSSSz5PWHBHv';
  static webpackedFilePath =
    process.env.WEBPACKED_FILE_PATH || '../dist/main.js';
  static keywords = process.env.TEST_KEYWORDS || [''];
  static nodeDir = process.env.NODE_DIR || '';

  static async getConfig() {
    Debugger.nodeDir = await this.getNodeDirectory();

    let destinationPath =
      'executables/' + (await this.gettask_audit_program()) + '.js';
    let logPath = 'namespace/' + Debugger.taskID + '/task.log';

    console.log('Debugger.nodeDir', Debugger.nodeDir);

    return {
      webpackedFilePath: Debugger.webpackedFilePath,
      destinationPath: destinationPath,
      keywords: Debugger.keywords,
      logPath: logPath,
      nodeDir: Debugger.nodeDir,
      taskID: Debugger.taskID,
    };
  }

  static async getNodeDirectory() {
    if (Debugger.nodeDir) {
      return Debugger.nodeDir;
    }
    const homeDirectory = os.homedir();
    let nodeDirectory;

    switch (os.platform()) {
      case 'linux':
        nodeDirectory = path.join(
          homeDirectory,
          '.config',
          'KOII-Desktop-Node',
        );
        break;
      case 'darwin':
        nodeDirectory = path.join(
          homeDirectory,
          'Library',
          'Application Support',
          'KOII-Desktop-Node',
        );
        break;
      case 'win32':
        // For Windows, construct the path explicitly as specified
        nodeDirectory = path.join(
          homeDirectory,
          'AppData',
          'Roaming',
          'KOII-Desktop-Node',
        );
        break;
      default:
        nodeDirectory = path.join(
          homeDirectory,
          'AppData',
          'Roaming',
          'KOII-Desktop-Node',
        );
    }

    return nodeDirectory;
  }

  static async gettask_audit_program() {
    const connection = new Connection('https://testnet.koii.network');
    const taskId = Debugger.taskID;
    const accountInfo = await connection.getAccountInfo(new PublicKey(taskId));
    if (!accountInfo) {
      console.log(`${taskId} doesn't contain any distribution list data`);
      return null;
    }
    let data;
    try {
      data = JSON.parse(accountInfo.data.toString());
    } catch (e) {
      const buffer = accountInfo.data;
      data = borsh_bpf_js_deserialize(buffer);
      data = parseTaskState(data);
    }

    console.log('data.task_audit_program', data.task_audit_program);
    return data.task_audit_program;
  }
}

function parseTaskState(taskState) {
  taskState.stake_list = objectify(taskState.stake_list, true);
  taskState.ip_address_list = objectify(taskState.ip_address_list, true);
  taskState.distributions_audit_record = objectify(
    taskState.distributions_audit_record,
    true,
  );
  taskState.distributions_audit_trigger = objectify(
    taskState.distributions_audit_trigger,
    true,
  );
  taskState.submissions = objectify(taskState.submissions, true);
  taskState.submissions_audit_trigger = objectify(
    taskState.submissions_audit_trigger,
    true,
  );
  taskState.distribution_rewards_submission = objectify(
    taskState.distribution_rewards_submission,
    true,
  );
  taskState.available_balances = objectify(taskState.available_balances, true);
  return taskState;
}

function objectify(data, recursive = false) {
  if (data instanceof Map) {
    const obj = Object.fromEntries(data);
    if (recursive) {
      for (const key in obj) {
        if (obj[key] instanceof Map) {
          obj[key] = objectify(obj[key], true);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = objectify(obj[key], true);
        }
      }
    }
    return obj;
  }
  return data;
}

export default Debugger;
