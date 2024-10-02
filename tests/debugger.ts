import os from "os";
import path from "path";
import { Connection, PublicKey } from "@_koii/web3.js";
import { borsh_bpf_js_deserialize } from "./wasm/bincode_js.cjs";
import { TASK_ID, TEST_KEYWORDS, WEBPACKED_FILE } from "../config";

class Debugger {
  static nodeDir = "";

  static async getConfig() {
    Debugger.nodeDir = await this.getNodeDirectory();

    let destinationPath =
      "executables/" + (await this.get_task_audit_program()) + ".js";
    let logPath = "namespace/" + TASK_ID + "/task.log";

    console.log("Debugger.nodeDir", Debugger.nodeDir);

    return {
      webpackedFilePath: WEBPACKED_FILE,
      destinationPath: destinationPath,
      keywords: TEST_KEYWORDS,
      logPath: logPath,
      nodeDir: Debugger.nodeDir,
      taskID: TASK_ID,
    };
  }

  static async getNodeDirectory() {
    if (Debugger.nodeDir) {
      return Debugger.nodeDir;
    }
    const homeDirectory = os.homedir();
    let nodeDirectory: string;

    switch (os.platform()) {
      case "linux":
        nodeDirectory = path.join(
          homeDirectory,
          ".config",
          "KOII-Desktop-Node",
        );
        break;
      case "darwin":
        nodeDirectory = path.join(
          homeDirectory,
          "Library",
          "Application Support",
          "KOII-Desktop-Node",
        );
        break;
      default:
        // Windows is the default
        nodeDirectory = path.join(
          homeDirectory,
          "AppData",
          "Roaming",
          "KOII-Desktop-Node",
        );
    }

    return nodeDirectory;
  }

  static async get_task_audit_program() {
    const connection = new Connection("https://testnet.koii.network");
    const taskId = TASK_ID;
    const accountInfo = await connection.getAccountInfo(new PublicKey(taskId));
    if (!accountInfo?.data) {
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

    console.log("data.task_audit_program", data.task_audit_program);
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
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          obj[key] = objectify(obj[key], true);
        }
      }
    }
    return obj;
  }
  return data;
}

export default Debugger;
