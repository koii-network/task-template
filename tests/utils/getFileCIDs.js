import { Connection, PublicKey } from "@_koii/web3.js";
import { borsh_bpf_js_deserialize } from "./wasm/bincode_js.cjs";

export async function getFileCIDs() {
  const connection = new Connection("https://testnet.koii.network");
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

  return {
    executable: data.task_audit_program,
    metadata: data.task_metadata,
  };
}
