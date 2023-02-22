const { namespaceWrapper } = require("./namespaceWrapper");
const crypto = require("crypto");

/**
 * @description Contains the logic to do the work required
 * for submitting the values and optionally store the result in levelDB
 */
async function task() {
  const x = Math.random().toString(); // generate random number and convert to string
  const cid = crypto.createHash("sha1").update(x).digest("hex"); // convert to CID
  console.log("HASH:", cid);

  if (cid) {
    await namespaceWrapper.storeSet("cid", cid); // store CID in levelDB
  }
  return false;
}

/**
 * @description Fetch's submission from levelDB
 * @returns {string} The CID
 */
async function fetchSubmission() {
  const cid = await namespaceWrapper.storeGet("cid"); // retrieves the cid
  return cid;
}

/**
 * @description Submits a node's result to K2
 * @param {number} roundNumber Current round number of the task
 */
async function submitTask(roundNumber) {
  console.log("submitTask called with round", roundNumber);
  try {
    console.log("inside try");
    console.log(
      await namespaceWrapper.getSlot(),
      "current slot while calling submit"
    );
    const cid = await fetchSubmission();
    await namespaceWrapper.checkSubmissionAndUpdateRound(cid, roundNumber); // submit to K2
    console.log("after the submission call");
  } catch (error) {
    console.log("error in submission", error);
  }
}

/**
 * @description Contains logic for the validation of submission value
 *
 * @param {string} submissionValue
 * @returns {boolean} The validity of the submission
 */
async function validateNode(submissionValue) {
  console.log("Validating Submission Value", submissionValue);
  const cid = submissionValue; // Retrieve node's submission value

  const char = cid.charAt(0);
  // If first character of cid is in the first 23 letters of the alphabet, return true
  if (char.match(/[a-w]/i)) {
    return true;
  } else {
    return false;
  }
}

/**
 * @description Submits validateNode function with roundNumber
 *
 * @param {number} roundNumber Current round number of the task
 */
async function auditTask(roundNumber) {
  console.log("auditTask called with round", roundNumber);
  console.log(
    await namespaceWrapper.getSlot(),
    "current slot while calling auditTask"
  );
  await namespaceWrapper.validateAndVoteOnNodes(validateNode, roundNumber);
}

/**
 * @description Genrates a distribution list that contains the key:value pair
 * of participating nodes public key and amount of KOII to be rewarded.
 * Introduce preffered rules when generating a distribution list
 * @param {number} round Current round of the task
 */
async function generateDistributionList(round) {
  console.log("GenerateDistributionList called");
  console.log("I am selected node");

  let distributionList = {}; // init distribution list
  const taskAccountDataJSON = await namespaceWrapper.getTaskState(); // init distribution list
  const submissions = taskAccountDataJSON.submissions[round];
  const submissions_audit_trigger =
                taskAccountDataJSON.submissions_audit_trigger[round];
  if (submissions == null) {
    console.log("No submissions found in N-2 round");
    return distributionList;
  } else {
    const keys = Object.keys(submissions);
    const values = Object.values(submissions);
    const size = values.length;
    console.log("Submissions from last round: ", keys, values, size);
    for (let i = 0; i < size; i++) {
      const candidatePublicKey = keys[i];
      if (submissions_audit_trigger && submissions_audit_trigger[candidatePublicKey]) {
        console.log(submissions_audit_trigger[candidatePublicKey].votes, "distributions_audit_trigger votes");
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
}

/**
 * @description Submits distribution list to K2 including the current round
 *
 * @param {number} round Current round of the task
 */
async function submitDistributionList(round) {
  console.log("SubmitDistributionList called");

  const distributionList = await generateDistributionList(); // get distribution list

  const decider = await namespaceWrapper.uploadDistributionList( 
    distributionList,
    round
  );
  console.log("DECIDER", decider);

  if (decider) {
    const response = await namespaceWrapper.distributionListSubmissionOnChain(
      round
    );
    console.log("RESPONSE FROM DISTRIBUTION LIST", response);
  }
}

/**
 * @description Contains logic for the validation of distribution list
 *
 * @param {string} distributionList
 * @returns {boolean} The validity of the distribution list
 */
async function validateDistribution(distributionList) {
  // Write your logic for the validation of submission value here and return a boolean value in response
  // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made
  console.log("Validating Distribution List", distributionList);
  return true;
}

/**
 * @description Submits validateDistribution function with roundNumber
 *
 * @param {number} roundNumber Current round number of the task
 */
async function auditDistribution(roundNumber) {
  console.log("auditDistribution called with round", roundNumber);
  await namespaceWrapper.validateAndVoteOnDistributionList(
    validateDistribution,
    roundNumber
  );
}

module.exports = {
  task,
  submitDistributionList,
  validateNode,
  validateDistribution,
  submitTask,
  auditTask,
  auditDistribution,
};
