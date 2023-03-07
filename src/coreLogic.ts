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
    }
  }
  async fetchSubmission() {
    // Write the logic to fetch the submission values here and return the cid string
  }

  async generateDistributionList(round: number) {
    console.log("GenerateDistributionList called");
    console.log("I am selected node");

    // Write the logic to generate the distribution list here by introducing the rules of your choice

    //  **** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******

    const distributionList = {};
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
        if (
          submissions_audit_trigger &&
          submissions_audit_trigger[candidatePublicKey]
        ) {
          console.log(
            submissions_audit_trigger[candidatePublicKey].votes,
            "distributions_audit_trigger votes "
          );
          const votes = submissions_audit_trigger[candidatePublicKey].votes;
          let numOfVotes = 0;
          for (let index = 0; index < votes.length; index++) {
            if (votes[i].is_valid) numOfVotes++;
            else numOfVotes--;
          }
          if (numOfVotes < 0) continue;
        }
        distributionList[candidatePublicKey] = 1;
      }
      return  distributionList;
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
    round: number
  ) => {
    // Write your logic for the validation of submission value here and return a boolean value in response
    // this logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made

    try {
      console.log("Distribution list Submitter", distributionListSubmitter);
      const fetchedDistributionList = JSON.parse(
        (await namespaceWrapper.getDistributionList(
          distributionListSubmitter,
          round
        )) as any
      );
      console.log("FETCHED DISTRIBUTION LIST", fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round
      );

      // compare distribution list

      const parsed = JSON.parse(fetchedDistributionList);
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
