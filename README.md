# KOI_Tasks

The following repo contains a CLI interface to interact with KOI Tasks and also guides on how you can create your very own KOI_Task. 

## Creating Your OWN KOI_Task

Creating your own KOI Task is pretty easy. The repo contains a folder `JS_APP_DEPLOY` Which is basically a test app, that would be executed when anyone in KOI_network decides to run you KOI_Task.

### Steps
1. Write Code in the `JS_APP_DEPLOT -> index.js` that you would want to execute at the each of KOI_clientNodes (Who would execute the task).
2. Run `npm run build` while in the `JS_APP_DEPLOT` directory. This would trigger a webpack build, building the application in a single file under `JS_APP_DEPLOT -> dist -> main.js`.
3. Deploy the file under `JS_APP_DEPLOT -> dist -> main.js` to the arweave `arweave deploy JS_APP_DEPLOT/dist/main.js --key-file path/to/arweave-key.json`.
4. 

