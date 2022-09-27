const express = require('express');
const TASK_NAME = process.argv[2];
const TASK_ID = process.argv[3];
const EXPRESS_PORT = process.argv[4];
const NODE_MODE = process.argv[5];

const app = express();


console.log("SETTING UP EXPRESS",NODE_MODE)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(EXPRESS_PORT, () => {
  console.log(`${TASK_NAME} listening on port ${EXPRESS_PORT}`);
});

module.exports={
    app,
    NODE_MODE
}
