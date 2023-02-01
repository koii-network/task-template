const crypto = require("crypto");
const { namespaceWrapper } = require("./namespaceWrapper");


async function task() {
  const x = Math.random().toString();
  const cid = crypto.createHash("sha1").update(x).digest("hex");
  return false;
}
async function generateAndSubmitDistributionList(round) {
  console.log("generateAndSubmitDistributionList called");
  // const selectedNode = await namespaceWrapper.nodeSelectionDistributionList(round);
  // console.log("selectedNode", selectedNode);
  // const submitterAccountKeyPair = await namespaceWrapper.getSubmitterAccount();
  // console.log({submitterAccountKeyPair});
  // const submitterPubkey = submitterAccountKeyPair.publicKey.toBase58();
  // if(selectedNode == submitterPubkey) {
    console.log("I am selected node");
    let distributionList = {};
    const taskAccountDataJSON = await namespaceWrapper.getTaskState();
    const submissions = taskAccountDataJSON.submissions[round];
    const submissions_audit_trigger =
                  taskAccountDataJSON.submissions_audit_trigger[round];
    if (submissions == null) {
      console.log("No submisssions found in N-2 round");
      return distributionList;
    } else {
      const keys = Object.keys(submissions);
      const values = Object.values(submissions);
      const size = values.length;
      console.log("Submissions from last round: ", keys, values, size);
      for (let i = 0; i < size; i++) {
        const candidatePublicKey = keys[i];
        if (submissions_audit_trigger && submissions_audit_trigger[candidatePublicKey]) {
          console.log(submissions_audit_trigger[candidatePublicKey].votes, "distributions_audit_trigger votes ");
          const votes = submissions_audit_trigger[candidatePublicKey].votes;
          let numOfVotes = 0;
          for (let index = 0; index < votes.length; index++) {
            if(votes[i].is_valid)
              numOfVotes++;
            else numOfVotes--;
          }
          if(numOfVotes < 0)
            continue;
        }
        distributionList[candidatePublicKey] = 1;  
      }
    }
    
    const decider = await namespaceWrapper.uploadDistributionList(
      distributionList, round
    );
    console.log("DECIDER", decider);
  
    if (decider) {
      const response = await namespaceWrapper.distributionListSubmissionOnChain(round);
      console.log("RESPONSE FROM DISTRIBUTION LIST", response);
    }
  // }
}


async function validateNode(node) {
  
// Write your logic for the validation of submission value here and return a boolean value in response

console.log("Validating Node", node);
  return true;
}

async function validateDistribution(node) {

// Write your logic for the validation of submission value here and return a boolean value in response
// this logic will we same as generation of distribution list function 
  console.log("Validating Node", node);
  return true;
}
// Submit Address with distributioon list to K2
async function submitTask(roundNumber) {
  console.log("submitTask called with round", roundNumber);
  try {
    console.log("inside try");
    console.log(await namespaceWrapper.getSlot(), "current slot while calling submit");
      const x = Math.random().toString();
  const cid = crypto.createHash("sha1").update(x).digest("hex");
    await namespaceWrapper.checkSubmissionAndUpdateRound(cid, roundNumber);
    console.log("after the submission call");
  } catch (error) {
    console.log("error in submission", error);
  }
}

async function auditTask(roundNumber) {
  console.log("auditTask called with round", roundNumber);
  console.log(await namespaceWrapper.getSlot(), "current slot while calling auditTask");
  await namespaceWrapper.validateAndVoteOnNodes(validateNode, roundNumber);
}

async function auditDistribution(roundNumber) {
  console.log("auditDistribution called with round", roundNumber);
  await namespaceWrapper.validateAndVoteOnDistributionList(validateDistribution, roundNumber);
}

module.exports = {
  task,
  generateAndSubmitDistributionList,
  validateNode,
  validateDistribution,
  submitTask,
  auditTask,
  auditDistribution
};
