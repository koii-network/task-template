const { namespaceWrapper } = require('./namespaceWrapper');
const linktree_task = require('./linktree_task');
const linktree_validate = require('./linktree_validate');
const crypto = require('crypto');
const dataFromCid = require("./helpers/dataFromCid");
const db = require('./db_model');

class CoreLogic {
  async task() {
    // TODO remove all of the prompts like the following line from the template version

    // run linktree task
    console.log('*********task() started*********');

    const proof_cid = await linktree_task();

    const round = await namespaceWrapper.getRound();

    // TEST For only testing purposes:
    // const round = 1000

    if (proof_cid) {
      await db.setNodeProofCid(round, proof_cid); // store CID in levelDB
      console.log('Node Proof CID stored in round', round)
    } else {
      console.log('CID NOT FOUND');
    }

    console.log('*********task() completed*********');
  }

  async fetchSubmission() {
    // The logic to fetch the submission values and return the cid string

    // fetching round number to store work accordingly

    console.log('***********IN FETCH SUBMISSION**************');
    // The code below shows how you can fetch your stored value from level DB
    
    // TEST For only testing purposes:
    // const round = 1000
    const round = await namespaceWrapper.getRound();
    
    const proof_cid = await db.getNodeProofCid(round - 1); // retrieves the cid
    console.log('Linktree proofs CID', proof_cid, "in round", round - 1);

    return proof_cid;
  }

  async generateDistributionList(round, _dummyTaskState) {
    try {
      console.log('GenerateDistributionList called');
      console.log('I am selected node');
      console.log('Round', round, 'Task State', _dummyTaskState);
      // The logic to generate the distribution list here

      let distributionList = {};
      let taskAccountDataJSON = await namespaceWrapper.getTaskState();

      if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;

      console.log('Task Account Data', taskAccountDataJSON);

      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger =
        taskAccountDataJSON.submissions_audit_trigger[round];

      if (submissions == null) {

        console.log('No submisssions found in N-2 round');
        return distributionList;

      } else {
        const keys = Object.keys(submissions);
        const values = Object.values(submissions);
        const size = values.length;
        console.log('Submissions from last round: ', keys, values, size);
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log(
              submissions_audit_trigger[candidatePublicKey].votes,
              'distributions_audit_trigger votes ',
            );
            const votes = submissions_audit_trigger[candidatePublicKey].votes;
            let numOfVotes = 0;
            for (let index = 0; index < votes.length; index++) {
              if (votes[index].is_valid) numOfVotes++;
              else numOfVotes--;
            }
            if (numOfVotes < 0) continue;
          }
          distributionList[candidatePublicKey] = 1;
        }
      }
      console.log('Distribution List', distributionList);
      return distributionList;
    } catch (err) {
      console.log('ERROR IN GENERATING DISTRIBUTION LIST', err);
    }
  }

  async submitDistributionList(round) {
    // This upload the generated dustribution List

    console.log('SubmitDistributionList called');

    try {
      const distributionList = await this.generateDistributionList(round);

      const decider = await namespaceWrapper.uploadDistributionList(
        distributionList,
        round,
      );
      console.log('DECIDER', decider);

      if (decider) {

        const response =
          await namespaceWrapper.distributionListSubmissionOnChain(round);
        console.log('RESPONSE FROM DISTRIBUTION LIST', response);
      }

    } catch (err) {
      console.log('ERROR IN SUBMIT DISTRIBUTION', err);
    }
  }

  // this function is called when a node is selected to validate the submission value
  async validateNode(submission_value, round) {
    console.log('Received submission_value', submission_value, round);

    // import the linktree validate module
    const vote = await linktree_validate(submission_value, round);
    console.log('Vote', vote);
    return vote;
  }

  async shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  validateDistribution = async (
    distributionListSubmitter,
    round,
    _dummyDistributionList,
    _dummyTaskState,
  ) => {

    try {
      console.log('Distribution list Submitter', distributionListSubmitter);
      const rawDistributionList = await namespaceWrapper.getDistributionList(
        distributionListSubmitter,
        round,
      );
      let fetchedDistributionList;
      if (rawDistributionList == null) {
        fetchedDistributionList = _dummyDistributionList;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }

      console.log('FETCHED DISTRIBUTION LIST', fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState,
      );

      // compare distribution list

      const parsed = fetchedDistributionList;
      console.log('compare distribution list', parsed, generateDistributionList);
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log('RESULT', result);
      return result;
    } catch (err) {
      console.log('ERROR IN VALIDATING DISTRIBUTION', err);
      return false;
    }
  };
  // Submit Address with distributioon list to K2
  async submitTask(roundNumber) {
    console.log('submitTask called with round', roundNumber);
    try {
      console.log('inside try');
      console.log(
        await namespaceWrapper.getSlot(),
        'current slot while calling submit',
      );
      const submission = await this.fetchSubmission();
      console.log('SUBMISSION', submission);
      // submit the submission to the K2
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );
      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  async auditTask(roundNumber) {

    console.log('auditTask called with round', roundNumber);
    console.log(
      await namespaceWrapper.getSlot(),
      'current slot while calling auditTask',
    );
    await namespaceWrapper.validateAndVoteOnNodes(
      this.validateNode,
      roundNumber,
    );
  }

  async auditDistribution(roundNumber) {
    console.log('auditDistribution called with round', roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      roundNumber,
    );
  }
}
const coreLogic = new CoreLogic();

module.exports = coreLogic;
