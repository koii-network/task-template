const { namespaceWrapper } = require('./namespaceWrapper');
const crypto = require('crypto');

/*

1. This is the coreLogic module, where all of your programmatic logic should go. 

2. The coreLogic module is imported into the index.js file and is run in rounds (https://docs.koii.network/concepts/gradual-consensus/)

3. Each round has three phases to it:

  a) Task Phase - This is where the work is done and the result is stored somewhere. 
  b) Submission Phase - This is where the result of the task executable is submitted to K2.
  c) Audit Phase - This is where the submitted values are fetched and audited and the nodes are rewarded or slashed based on the audit results.

/*
    NOTE: THE BELOW FUNCTIONS ARE JUST SAMPLES AND CAN BE MODIFIED AS PER YOUR TASK REQUIREMENTS
*/

class CoreLogic {


 /*
  The logic for what your task should do goes here. There is a window in round  that is dedicated to do work. The code in task is executed in that window.
  The result of the task is stored to NE DB (local database) as well as a main storage like IPFS. The result is stored in a variable, usually a CID. 
 */

  async task() {
  
    try {
      const x = Math.random().toString(); // generate random number and convert to string
      const cid = crypto.createHash('sha1').update(x).digest('hex'); // convert to CID
      console.log('HASH:', cid);

      // fetching round number to store work accordingly

      if (cid) {
        await namespaceWrapper.storeSet('cid', cid); // store CID in levelDB
      }
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
    }
  }

  /*
  After the task logic has been run, we need to fetch the result of the task from the storage using the variable it was stored in (usually a CID).
  This function is the place where you can write the logic to fetch that work. It is called in submitTask() function which does the actual submission to K2.
  */

  async fetchSubmission() {

    // Write the logic to fetch the submission values here and return the cid string

    // fetching round number to store work accordingly

    console.log('IN FETCH SUBMISSION');

    // The code below shows how you can fetch your stored value from level DB

    const cid = await namespaceWrapper.storeGet('cid'); // retrieves the cid
    console.log('CID', cid);
    return cid;
  }

  /*
  This function is called to generate the distribution list. You are free to define your own 
  rules for how you want the rewards to be submitted. The distribution list is then submitted to K2 using the submitDistributionList() function.
  */

  async generateDistributionList(round, _dummyTaskState) {
    try {
      console.log('GenerateDistributionList called');
      console.log('I am selected node');


      /*  **** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/

      let distributionList = {};
      let distributionCandidates = [];
      let taskAccountDataJSON = await namespaceWrapper.getTaskState();
      if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;
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

        // Logic for slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log(
              'distributions_audit_trigger votes ',
              submissions_audit_trigger[candidatePublicKey].votes,
            );
            const votes = submissions_audit_trigger[candidatePublicKey].votes;
            if (votes.length === 0) {
              // slash 70% of the stake as still the audit is triggered but no votes are casted
              // Note that the votes are on the basis of the submission value
              // to do so we need to fetch the stakes of the candidate from the task state
              const stake_list = taskAccountDataJSON.stake_list;
              const candidateStake = stake_list[candidatePublicKey];
              const slashedStake = candidateStake * 0.7;
              distributionList[candidatePublicKey] = -slashedStake;
              console.log('Candidate Stake', candidateStake);
            } else {
              let numOfVotes = 0;
              for (let index = 0; index < votes.length; index++) {
                if (votes[index].is_valid) numOfVotes++;
                else numOfVotes--;
              }

              if (numOfVotes < 0) {
                // slash 70% of the stake as the number of false votes are more than the number of true votes
                // Note that the votes are on the basis of the submission value
                // to do so we need to fetch the stakes of the candidate from the task state
                const stake_list = taskAccountDataJSON.stake_list;
                const candidateStake = stake_list[candidatePublicKey];
                const slashedStake = candidateStake * 0.7;
                distributionList[candidatePublicKey] = -slashedStake;
                console.log('Candidate Stake', candidateStake);
              }

              if (numOfVotes > 0) {
                distributionCandidates.push(candidatePublicKey);
              }
            }
          } else {
            distributionCandidates.push(candidatePublicKey);
          }
        }
      }

      // now distribute the rewards based on the valid submissions
      // Here it is assumed that all the nodes doing valid submission gets the same reward

      const reward =
        taskAccountDataJSON.bounty_amount_per_round /
        distributionCandidates.length;
      console.log('REWARD RECEIVED BY EACH NODE', reward);
      for (let i = 0; i < distributionCandidates.length; i++) {
        distributionList[distributionCandidates[i]] = reward;
      }
      console.log('Distribution List', distributionList);
      return distributionList;
    } catch (err) {
      console.log('ERROR IN GENERATING DISTRIBUTION LIST', err);
    }
  }


  /*
  This function submits the distribution list generated by generateDistributionList() to K2.
  */

  async submitDistributionList(round) {
    // This function just upload your generated dustribution List and do the transaction for that

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

  /*
  This function is called to verify the submission value, so based on the value received from the task-state we can vote on the submission.
  */

  async validateNode(submission_value, round) {

    // Write your logic for the validation of submission value here and return a boolean value in response

    // The sample logic can be something like mentioned below to validate the submission

    // try{

    console.log('Received submission_value', submission_value, round);
    // const generatedValue = await namespaceWrapper.storeGet("cid");
    // console.log("GENERATED VALUE", generatedValue);
    // if(generatedValue == submission_value){
    //   return true;
    // }else{
    //   return false;
    // }
    // }catch(err){
    //   console.log("ERROR  IN VALDIATION", err);
    //   return false;
    // }

    // For succesfull flow we return true for now
    return true;
  }

  /*
  This function compares two objects, object1 and object2, to determine if they have shallow equality. 
  Shallow equality means that the objects have the same set of keys and the values associated with 
  those keys are strictly equal (=== comparison).
  */


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

  /*
    The validateDistribution function contains the logic of how the distribution list should be audited to check validity of it
  */

  validateDistribution = async (
    distributionListSubmitter,
    round,
    _dummyDistributionList,
    _dummyTaskState,
  ) => {

    // Write your logic for the validation of submission value here and return a boolean value in response
    // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made

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
      console.log(
        'compare distribution list',
        parsed,
        generateDistributionList,
      );
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log('RESULT', result);
      return result;
    } catch (err) {
      console.log('ERROR IN VALIDATING DISTRIBUTION', err);
      return false;
    }
  };

  /* 
  The submitTask function calls the fetchSubmission() to retrieve the value from levelDB and submits it to K2 using the 
  checkSubmissionAndUpdateRound() helper function.
  */

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
      await namespaceWrapper.checkSubmissionAndUpdateRound(
        submission,
        roundNumber,
      );
      console.log('after the submission call');
    } catch (error) {
      console.log('error in submission', error);
    }
  }

  /*Makes a call to a namespace of task-node to raise an audit against the submission value if the validation fails. */

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

  /* The auditDistribution function takes the roundNumber as a parameter and calls the v
  `alidateAndVoteOnDistributionList helper function which takes in the validateDistribution
   function and roundNumber as parameters. */

  async auditDistribution(roundNumber) {
    console.log('auditDistribution called with round', roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      roundNumber,
    );
  }
}
const coreLogic = new CoreLogic();

module.exports = { coreLogic };
