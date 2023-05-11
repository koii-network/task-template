import * as express from "express";

const EXPRESS_PORT = process.argv[4];
const TASK_NAME = process.argv[2];

export const TASK_ID = process.argv[3];
export const NODE_MODE = process.argv[5];
export const MAIN_ACCOUNT_PUBKEY = process.argv[6];
export const SECRET_KEY = process.argv[7];
export const K2_NODE_URL = process.argv[8];
export const SERVICE_URL = process.argv[9];
export const STAKE = Number(process.argv[10]);
export const TASK_NODE_PORT = Number(process.argv[11]);
export const app = express();

console.log("SETTING UP EXPRESS", NODE_MODE);
app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

app.listen(EXPRESS_PORT, () => {
  console.log(`${TASK_NAME} listening on port ${EXPRESS_PORT}`);
});

module.exports = {
  app,
  NODE_MODE,
  TASK_ID,
  MAIN_ACCOUNT_PUBKEY,
  SECRET_KEY,
  K2_NODE_URL,
  SERVICE_URL,
  STAKE,
  TASK_NODE_PORT,
};
