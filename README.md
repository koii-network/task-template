# Federated Deployer
This [Koii Task](https://docs.koii.network/microservices-and-tasks/what-are-tasks) provides a framework for deploying trusted-execution-environments in a decentralized and trustless way. 

For context, Koii Tasks provide a framework for:
1. JavaScript [runtime environments](https://docs.koii.network/microservices-and-tasks/what-are-tasks/runtime-environment) on thousands of home computers
2. Incentive and audit mechanisms to provide [feedback towards an intended function](https://docs.koii.network/microservices-and-tasks/what-are-tasks/gradual-consensus)
3. Convenient and efficient [payment rails](https://docs.koii.network/settlement-layer/k2-tick-tock-fast-blocks) for [Decentralized Autonomous Corporations](https://rossdawson.com/futurist/companies-creating-future/top-decentralized-autonomous-organizations-dao/) and community public goods



### Deploy to K2
To test the task with the [K2 Settlement Layer](https://docs.koii.network/settlement-layer/k2-tick-tock-fast-blocks) you'll need to deploy it. 

We have included our CLI for creating and publish tasks to the K2 network in this repo. Tips on this flow can be found [in the docs](https://docs.koii.network/koii-software-toolkit-sdk/create-task-cli). One important thing to note is when you're presented with the choice of ARWEAVE, IPFS, or DEVELOPMENT you can select DEVELOPMENT and enter `main` in the following prompt. This will tell the task node to look for a `main.js` file in the `dist` folder. You can create this locally by running `yarn webpack`.

## Run a node locally
If you want to get a closer look at the console and test environment variables, you'll want to use the included docker-compose stack to run a task node locally.

1. Link or copy your wallet into the `config` folder as `id.json`
2. Open `.env-local` and add your TaskID you obtained after deploying to K2 into the `TASKS` environment variable.\
3. Run `docker compose up` and watch the output of the `task_node`. You can exit this process when your task has finished, or any other time if you have a long running persistent task.

### Redeploying
You do not need to publish your task every time you make modifications. You do however need to restart the `task_node` in order for the latest code to be used. To prepare your code you can run `yarn webpack` to create the bundle. If you have a `task_node` ruinning already, you can exit it and then run `docker compose up` to restart (or start) the node.

### Environment variables
Open the `.env-local` file and make any modifications you need. You can include environment variables that your task expects to be present here, in case you're using [custom secrets](https://docs.koii.network/microservices-and-tasks/task-development-kit-tdk/using-the-task-namespace/keys-and-secrets).
