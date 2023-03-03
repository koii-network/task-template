# K2-Task-Template
Tasks run following a periodic structure of 'rounds':
```
executeTask => {
  1. Do the work
  2. Audit the work of other nodes
  3. Pay rewards and slash stake
}
```

Each round is set by a specific time period, and nodes participate by uploading data to IPFS, posting CIDs to the K2 settlement layer, and sending messages across REST APIs and WebSockets. 

For more information on how the Task Flow works, check out [the runtime environment docs](https://docs.koii.network/microservices-and-tasks/what-are-tasks/gradual-consensus).

## What's in the template?
`index.js` is the hub of your app, and ties together the other pieces. This will be the entrypoint when your task runs on Task Nodes

`NamespaceWrappers.js` contains the interfaces to make API calls to the core of the task-node. It contains all the necessary functions required to submit and audit the work, as well as the distribution lists 

`coreLogic.js` is where you'll define your task, audit, and distribution logic, and controls the majority of task functionality. You can of course break out separate features into sub-files and import them into the core logic before web-packing.

## Runtime Options
There are two ways to run your task when doing development:

1. With Timer ON (see .env-local)- When the timer is ON, IPC calls are made by calculating the average time slots of all the task running your node. 

2. With Timer OFF - This allows you to do manual calls to K2 and disables the triggers for round managemnt on K2. Transactions are only accepted during the correct period. Guide for manual calls is in index.js

# Modifying CoreLogic.js
Task nodes will trigger a set of predefined functions during operation. 

There are in total 9 functions in CoreLogic which the you can modify according to your needs: 

1. *task()* - The logic for what your task should do goes here. There is a window in round that is dedicated to do work. The code in task is executed in that window. 

2. *fetchSubmission()* - After completing the task , the results/work will be stored somewhere like on IPFS or local levelDB. This function is the place where you can write the logic to fetch that work. It is called in submitTask() function which does the actual submission on K2. 

3. *submitTask()* - It makes the call to namespace function of task-node using the wrapper. 

4. *generateDistributionList()*  - You have full freedom to prepare your reward distributions as you like and the logic for that goes here. We have provided a sample logic that rewards 1 KOII to all the needs who did the correct submission for that round. This function is called in submitDistributionList()

5. *submitDistributionList()* - makes call to the namesapce function of task-node to upload the list and on succesful upload does the transaction to update the state.

6. *validateNode()* - this function is called to verify the submission value, so based on the value received from the task-state we can vote on the submission.

7. *validateDistribution()* - The logic to validate the distribution list goes here and the function will receive the distribution list submitted form task-state.

8. *auditTask()* - makes call to namespace of task-node to raise an audit against the submission value if the validation fails. 

9. *auditDistribution()* - makes call to namespace of task-node to raise an audit against the distribution list if the validation fails.

# Testing and Deploying
Before you begin this process, be sure to check your code and write unit tests wherever possible to verify individual core logic functions. Testing using the docker container should be mostly used for consensus flows, as it will take longer to rebuild and re-deploy the docker container.

## Build
Before deploying a task, you'll need to build it into a single file executable by running
`yarn webpack`

## Deploy your bundle

### To get a web3.storage key
If you have already created an account on [web3.storage](https://web3.storage/docs/#quickstart) you'll just need to enter the API key after the prompts in the deploy process.

### Find or create a k2 wallet key

If you have already generated a Koii wallet on yoru filesystem you can obtain the path to it by running `koii config get` which should return something similar to the following:
```
➜ koii config get
Config File: /home/<user>/.config/koii/cli/config.yml
RPC URL: https://k2-testnet.koii.live 
WebSocket URL: wss://k2-testnet.koii.live/ (computed)
Keypair Path: /home/<user>/.config/koii/id.json 
Commitment: confirmed 

```
The `Keypair Path` will be used to pay gas fees and fund your bounty wallet by inputting it into the task CLI.

If you need to create a Koii wallet you can follow the instructions [here](https://docs.koii.network/koii-software-toolkit-sdk/using-the-cli#create-a-koii-wallet). Make sure to either copy your keypair path from the output, or use the method above to supply the task CLI with the proper wallet path.

### Deploy to K2
To test the task with the [K2 Settlement Layer](https://docs.koii.network/settlement-layer/k2-tick-tock-fast-blocks) you'll need to deploy it. 

We have included our CLI for creating and publish tasks to the K2 network in this repo. Tips on this flow can be found [in the docs](https://docs.koii.network/koii-software-toolkit-sdk/create-task-cli). 

## Run a node locally
If you want to get a closer look at the console and test environment variables, you'll want to use the included docker-compose stack to run a task node locally.

### Environment variables
Copy the `.env-local` file to `.env` and make any modifications you need. You can include environment variables that your task expects to be present here.

`docker-compose up`

You can also modify the sample `.env-local` to suit your particular task, in case you're using [custom secrets](https://docs.koii.network/microservices-and-tasks/task-development-kit-tdk/using-the-task-namespace/keys-and-secrets).
