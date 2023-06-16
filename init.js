const express = require('express');
// Only used for testing purposes, in production the env will be injected by tasknode
require('dotenv').config();
const bodyParser = require('body-parser');

const TASK_NAME = process.argv[2] || 'Local';
const TASK_ID = process.argv[3];
const EXPRESS_PORT = process.argv[4] || 10000;
const NODE_MODE = process.argv[5];
const MAIN_ACCOUNT_PUBKEY = process.argv[6];
const SECRET_KEY = process.argv[7];
const K2_NODE_URL = process.argv[8];
const SERVICE_URL = process.argv[9];
const STAKE = Number(process.argv[10]);
const TASK_NODE_PORT = Number(process.argv[11]);

const app = express();

console.log('SETTING UP EXPRESS');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', false);
  if (req.method === 'OPTIONS')
    // if is preflight(OPTIONS) then response status 204(NO CONTENT)
    return res.send(204);
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const _server = app.listen(EXPRESS_PORT, () => {
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
