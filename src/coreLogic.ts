import { GenericResponseInterface } from "./interfaces/ResponseInterface";
import { namespaceWrapper } from "./namespaceWrapper";
import * as crypto from "crypto";

class CoreLogic {
  async task() {
    // Write the logic to do the work required for submitting the values and optionally store the result in levelDB

    // Below is just a sample of work that a task can do

    try {
      const x = Math.random().toString(); // generate random number and convert to string
      const cid = crypto.createHash("sha1").update(x).digest("hex"); // convert to CID
      console.log("HASH:", cid);

      // fetching round number to store work accordingly

      if (cid) {
        await namespaceWrapper.storeSet("cid", cid); // store CID in levelDB
      }
    } catch (err) {
      console.log("ERROR IN EXECUTING TASK", err);
      return "ERROR IN EXECUTING TASK" + err;
    }
    return Promise.resolve({});
  }
  async fetchSubmission() {
    // Write the logic to fetch the submission values here and return the cid string

    console.log("IN FETCH SUBMISSION");

    // The code below shows how you can fetch your stored value from level DB

    const cid = await namespaceWrapper.storeGet("cid"); // retrieves the cid
    console.log("CID", cid);
    return cid;
  }

  // change this function immensly
  // 1. 80 % based on the staking list

  async generateDistributionList(
    round: number,
    _dummyTaskState?: GenericResponseInterface
  ) {
    try {
      console.log("GenerateDistributionList called");
      console.log("I am selected node");

      // Write the logic to generate the distribution list here by introducing the rules of your choice

      /*  **** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/

      const distributionList = {};
      const distributionCandidates = [];
      let taskAccountDataJSON = await namespaceWrapper.getTaskState();
      if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;
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

        // Logic for slashing the stake of the candidate who has been audited and found to be false
        for (let i = 0; i < size; i++) {
          const candidatePublicKey = keys[i];
          if (
            submissions_audit_trigger &&
            submissions_audit_trigger[candidatePublicKey]
          ) {
            console.log(
              "distributions_audit_trigger votes ",
              submissions_audit_trigger[candidatePublicKey].votes
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
              console.log("Candidate Stake", candidateStake);
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
                console.log("Candidate Stake", candidateStake);
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
      console.log("REWARD RECEIVED BY EACH NODE", reward);
      for (let i = 0; i < distributionCandidates.length; i++) {
        distributionList[distributionCandidates[i]] = reward;
      }
      console.log("Distribution List", distributionList);
      return distributionList;
    } catch (err) {
      console.log("ERROR IN GENERATING DISTRIBUTION LIST", err);
      return Promise.reject(err);
    }
  }

  async submitDistributionList(round: number) {
    console.log("SubmitDistributionList called");

    const distributionList = await this.generateDistributionList(round);

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

  async validateNode(submission_value: any, round: any) {
    // Write your logic for the validation of submission value here and return a boolean value in response

    console.log("Received submission_value", submission_value, round);
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

  async shallowEqual(object1: object, object2: object) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  }

  validateDistribution = async (
    distributionListSubmitter: any,
    round: number,
    _dummyDistributionList,
    _dummyTaskState
  ) => {
    // Write your logic for the validation of submission value here and return a boolean value in response
    // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made

    try {
      console.log("Distribution list Submitter", distributionListSubmitter);
      const rawDistributionList = await namespaceWrapper.getDistributionList(
        distributionListSubmitter,
        round
      );
      let fetchedDistributionList;
      if (rawDistributionList == null) {
        fetchedDistributionList = _dummyDistributionList;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }
      console.log("FETCHED DISTRIBUTION LIST", fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState
      );

      // compare distribution list

      const parsed = fetchedDistributionList;
      console.log(
        "compare distribution list",
        parsed,
        generateDistributionList
      );
      const result = await this.shallowEqual(parsed, generateDistributionList);
      console.log("RESULT", result);
      return result;
    } catch (err) {
      console.log("ERROR IN VALIDATING DISTRIBUTION", err);
      return false;
    }
  };
  // Submit Address with distributioon list to K2
  async submitTask(round: number) {
    console.log("submitTask called with round", round);
    try {
      console.log("inside try");
      console.log(
        await namespaceWrapper.getSlot(),
        "current slot while calling submit"
      );
      const cid = await this.fetchSubmission();
      await namespaceWrapper.checkSubmissionAndUpdateRound(cid, round);
      console.log("after the submission call");
    } catch (error) {
      console.log("error in submission", error);
    }
  }

  async auditTask(round: number) {
    console.log("auditTask called with round", round);
    console.log(
      await namespaceWrapper.getSlot(),
      "current slot while calling auditTask"
    );
    await namespaceWrapper.validateAndVoteOnNodes(this.validateNode, round);
  }

  async auditDistribution(round: number) {
    console.log("auditDistribution called with round", round);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      round
    );
  }
}

export const coreLogic = new CoreLogic();
