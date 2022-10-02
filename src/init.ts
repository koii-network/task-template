import express, { Response ,Request}  from 'express';

const EXPRESS_PORT = process.argv[4];
const TASK_NAME = process.argv[2];

export const TASK_ID = process.argv[3];
export const NODE_MODE = process.argv[5];
export const MAIN_ACCOUNT_PUBKEY = process.argv[6];
export const SECRET_KEY = process.argv[7];
export const app = express();

console.log('SETTING UP EXPRESS', NODE_MODE);
app.get('/', (_req:Request, res:Response) => {
  res.send('Hello World!');
});

app.listen(EXPRESS_PORT, () => {
  console.log(`${TASK_NAME} listening on port ${EXPRESS_PORT}`);
});


