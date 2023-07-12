import * as express from "express";
import * as bodyParser from "body-parser";

import * as dotenv from "dotenv";
dotenv.config();

export const EXPRESS_PORT = process.argv[4] || 10000;
export const TASK_NAME = process.argv[2] || "Local";

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

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Credentials", "false");
    if (req.method === "OPTIONS")
      // if is preflight(OPTIONS) then response status 204(NO CONTENT)
      return res.sendStatus(204);
    return next();
  }
);

app.get("/", (_req: express.Request, res: express.Response) => {
  res.send("Hello World!");
});

export const _server = app.listen(EXPRESS_PORT, () => {
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
  _server,
};
