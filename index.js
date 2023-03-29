const {coreLogic} = require("./coreLogic");
const { app, MAIN_ACCOUNT_PUBKEY } = require("./init");
const { namespaceWrapper } = require("./namespaceWrapper");


async function setup() {
  console.log("setup function called");
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on("message", (m) => {
    console.log("CHILD got message:", m);
    if (m.functionCall == "submitPayload") {
      console.log("submitPayload called");
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == "auditPayload") {
      console.log("auditPayload called");
      coreLogic.auditTask(m.roundNumber);
    }
    else if(m.functionCall == "executeTask") {
      console.log("executeTask called");
      coreLogic.task();
    }
    else if(m.functionCall == "generateAndSubmitDistributionList") {
      console.log("generateAndSubmitDistributionList called");
      coreLogic.submitDistributionList(m.roundNumber);
    }
    else if(m.functionCall == "distributionListAudit") {
      console.log("distributionListAudit called");
      coreLogic.auditDistribution(m.roundNumber);
    }
  });

    // Code for the data replication among the nodes
    setInterval(async () => {
      try {
        const nodesUrl = `${SERVICE_URL}/nodes/${TASK_ID}`;
        const res = await axios.get(nodesUrl);
        if (res.status != 200) {
          console.error('Error', res.status);
          return;
        }
  
        if (!res.data) {
          console.error('res has no valid urls');
          return;
        }
        let nodeUrlList = res.data.map((e) => {
          return e.data.url;
        });
        console.log(nodeUrlList);
        let allLinktrees = await namespaceWrapper.storeGet('linktrees');
        allLinktrees = JSON.parse(allLinktrees || '[]');
        for (let url of nodeUrlList) {
          console.log(url);
          const res = await axios.get(`${url}/task/${TASK_ID}/get-all-linktrees`);
          if (res.status != 200) {
            console.error('ERROR', res.status);
            continue;
          }
          const payload = res.data;
          /*
        1. Verify the signature
        2. Only update your db if incoming timestamp > your timestamp or you don't have the data
        */
          if (!payload || payload.length == 0) continue;
          for (let linkTreePayload in payload) {
            const isVerified = nacl.sign.detached.verify(
              new TextEncoder().encode(JSON.stringify(linkTreePayload.data)),
              bs58.decode(linkTreePayload.signature),
              bs58.decode(linkTreePayload.publicKey)
            );
            if (!isVerified) {
              console.warn(`${url} is not able to verify the signature`);
              continue;
            }
            let localExistingLinktree = allLinktrees.find((e) => {
              e.uuid == linkTreePayload.data.uuid;
            });
            if (localExistingLinktree) {
              if (localExistingLinktree.data.timestamp < linkTreePayload.data.timestamp) {
                allLinktrees.push(linkTreePayload);
              }
            } else {
              allLinktrees.push(linkTreePayload);
            }
          }
        }
      } catch (error) {
        console.error('Some went wrong:', error);
      }
    }, 20000);

  /* GUIDE TO CALLS K2 FUNCTIONS MANUALLY

  If you wish to do the development by avoiding the timers then you can do the intended calls to K2 
  directly using these function calls. 

  To disable timers please set the TIMERS flag in task-node ENV to disable

  NOTE : K2 will still have the windows to accept the submission value, audit, so you are expected
  to make calls in the intended slots of your round time. 

  */

  // console.log("*******************TESTING*******************")
  // Get the task state 
  // console.log(await namespaceWrapper.getTaskState());

  // Get account public key
  // console.log(MAIN_ACCOUNT_PUBKEY);

  // GET ROUND 
  // const round = await namespaceWrapper.getRound();
  // console.log("ROUND", round);


  // Call to do the work for the task
  // await coreLogic.task();

  // Submission to K2 (Preferablly you should submit the cid received from IPFS)
  // await coreLogic.submitTask(round - 1);

  // Audit submissions 
  // await coreLogic.auditTask(round - 1);

  // upload distribution list to K2

  //await coreLogic.submitDistributionList(round - 2)

  // Audit distribution list

  //await coreLogic.auditDistribution(round - 2);

  // Payout trigger

  // const responsePayout = await namespaceWrapper.payoutTrigger();
  // console.log("RESPONSE TRIGGER", responsePayout);






}

setup();

if (app) {
  // Sample API that return your task state 
  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState();
   console.log("TASK STATE", state);

  res.status(200).json({ taskState: state })
  })

  // API to register the linktree
  app.post('/register-linktree', async (req, res) => {
    const linktree = req.body.payload;
    // TODO: validate the linktree structure here
    /*
      1. Must have the following structure
      2. Signature must be verified by the publicKey
    */

    /*
      {
        data:{
          uuid:jhasjdbjhguyt23764vhyt
          linktree:linktree,
          timestamp:76576465,
        },
        publicKey:"FnQm11NXJxPSjza3fuhuQ6Cu4fKNqdaPkVSRyLSWf14d",
        signature:"hjgasdjasbhmnbjhasgdkjsahjdkhgsakjdhgsajhyg"
      }
    */
    // Use the code below to sign the data payload
    // const msg = new TextEncoder().encode(JSON.stringify(data));
    // const signature = nacl.sign.detached(msg, secretKey);

    let allLinktrees = await namespaceWrapper.storeGet('linktrees');
    allLinktrees = JSON.parse(allLinktrees || '[]');
    allLinktrees.push(linktree);
    await namespaceWrapper.storeSet('linktrees', JSON.stringify(allLinktrees));
    return res.status(200).send({message: 'Linktree registered successfully'});
  });
  app.get('/get-all-linktrees', async (req, res) => {
    let allLinktrees = await namespaceWrapper.storeGet('linktrees');
    allLinktrees = JSON.parse(allLinktrees || '[]');
    return res.status(200).send(allLinktrees);
  });
}

