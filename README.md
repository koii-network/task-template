# KOI_Tasks

The following repo contains a CLI interface to interact with KOI Tasks and also guides on how you can create your very own KOI_Task. 

## Running KOI_Tasks

You can run any task from the available list of KOI_Tasks and enjoy the KOI_Reward associated with that task.

### Steps

1. Run `node KOI_Tasks.js`, this will get the list of available tasks from the Smart Contract (This might take few seconds - TODO: Get cached state from bundler once this smart contract is merged with original one).
2. Then you will be prompted with two options `Show KOI Tasks` and `Add KOI task`.
3. You can select `Show KOI Tasks` to view the list of available tasks.(For adding your own KOI_Task refer to next section)
4. Then you can enter the Id or name of any task which you want to run.
5. The KOI associated with that task will get transfered to your wallet once the task is sucessfully completed and submitted to bundler(TODO: Need to combine this smart contract with original one)
## Creating Your OWN KOI_Task

Creating your own KOI Task is pretty easy. The repo contains a folder `JS_APP_DEPLOY` Which is basically a test app, that would be executed when anyone in KOI_network decides to run you KOI_Task.

### Steps
1. Write Code in the `JS_APP_DEPLOT -> index.js` that you would want to execute at the each of KOI_clientNodes (Who would execute the task).
2. Run `npm run build` while in the `JS_APP_DEPLOT` directory. This would trigger a webpack build, building the application in a single file under `JS_APP_DEPLOT -> dist -> main.js`.
3. Deploy the file under `JS_APP_DEPLOT -> dist -> main.js` to the arweave `arweave deploy JS_APP_DEPLOT/dist/main.js --key-file path/to/arweave-key.json`.
4. Then run `node KOI_Tasks.js`, select `Add KOI Task`, enter your task name, Task File Url (Obtained from step 3) and then KOI_Reward you want to stake for this particular task.

