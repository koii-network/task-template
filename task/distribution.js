const { namespaceWrapper } = require('@_koii/namespace-wrapper');
const { makeRewardList } = require('../editTask.js');

class Distribution {
  /**
   * Generates and submits the distribution list for a given round
   * @param {number} round - The current round number
   * @returns {void}
   *
   */
  submitDistributionList = async round => {
    console.log(`SUBMIT DISTRIBUTION LIST CALLED WITH ROUND ${round}`);
    try {
      const distributionList = await this.generateDistributionList(round);
      if (!Object.keys(distributionList).length) {
        return console.log('NO DISTRIBUTION LIST GENERATED');
      }
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
  };

  /**
   * Audits the distribution list for a given round
   * @param {number} roundNumber - The current round number
   * @returns {void}
   *
   */
  async auditDistribution(roundNumber) {
    console.log('AUDIT DISTRIBUTION CALLED WITHIN ROUND: ', roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(
      this.validateDistribution,
      roundNumber,
    );
  }
  /**
   * Generates the distribution list for a given round in your logic
   * @param {number} round - The current round number
   * @returns {Promise<object>} The distribution list for the given round
   */
  async generateDistributionList(round) {
    try {
      console.log('GENERATE DISTRIBUTION LIST CALLED WITH ROUND', round);
      let distributionList = {};

      let taskAccountDataJSON, taskStakeListJSON;
      try {
        taskAccountDataJSON =
          await namespaceWrapper.getTaskSubmissionInfo(round);
        taskStakeListJSON = await namespaceWrapper.getTaskState({
          is_stake_list_required: true,
        });
      } catch (error) {
        console.error('ERROR FETCHING TASK SUBMISSION DATA', error);
        return distributionList;
      }
      if (!taskAccountDataJSON || !taskStakeListJSON) {
        console.error('ERROR IN FETCHING TASK SUBMISSION DATA');
        return distributionList;
      }
      if (!taskAccountDataJSON?.submissions[round]) {
        console.log(`NO SUBMISSIONS FOUND IN ROUND ${round}`);
        return distributionList;
      }
      const submissions = taskAccountDataJSON.submissions[round];
      const submissions_audit_trigger =
        taskAccountDataJSON.submissions_audit_trigger[round];
      console.log(taskAccountDataJSON.submissions);
      if (!submissions) {
        return distributionList;
      }
      const keys = Object.keys(submissions);
      const stakeList = taskStakeListJSON.stake_list;
      let candidates = [];
      // Edit Your Stake Slash Logic Here
      keys.forEach(candidatePublicKey => {
        const votes =
          submissions_audit_trigger?.[candidatePublicKey]?.votes || [];
        const validVotes = votes.reduce(
          (acc, vote) => acc + (vote.is_valid ? 1 : -1),
          0,
        );
        candidates.push({
          publickey: candidatePublicKey,
          votes: validVotes,
          stake: stakeList[candidatePublicKey],
        });
      });
      distributionList = makeRewardList(
        round,
        candidates,
        taskStakeListJSON.bounty_amount_per_round,
      );
      console.log('FINAL DISTRIBUTION LIST', distributionList);
      return distributionList;
    } catch (err) {
      console.log('ERROR GENERATING DISTRIBUTION LIST', err);
    }
  }

  /**
   * Validates the distribution list for a given round in your logic
   * The logic can be same as generation of distribution list function and based on the comparision will final object , decision can be made
   * @param {string} distributionListSubmitter - The public key of the distribution list submitter
   * @param {number} round - The current round number
   * @param {object} _dummyDistributionList
   * @param {object} _dummyTaskState
   * @returns {Promise<boolean>} The validation result, return true if the distribution list is correct, false otherwise
   */
  validateDistribution = async (
    distributionListSubmitter,
    round,
    _dummyDistributionList,
    _dummyTaskState,
  ) => {
    try {
      console.log('DISTRIBUTION LIST SUBMITTER', distributionListSubmitter);
      const rawDistributionList = await namespaceWrapper.getDistributionList(
        distributionListSubmitter,
        round,
      );
      let fetchedDistributionList;
      if (rawDistributionList == null) {
        return true;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }
      console.log('FETCHED DISTRIBUTION LIST', fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState,
      );

      if (Object.keys(generateDistributionList).length === 0) {
        console.log('UNABLE TO GENERATE DISTRIBUTION LIST');
        return true;
      }
      const parsed = fetchedDistributionList;
      console.log(
        'COMPARE DISTRIBUTION LIST',
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
  /**
   * Compares two objects for equality
   * @param {object} parsed - The first object
   * @param {object} generatedDistributionList - The second object
   * @returns {boolean} The result of the comparison
   */
  async shallowEqual(parsed, generatedDistributionList) {
    const normalize = obj => (typeof obj === 'string' ? JSON.parse(obj) : obj);
    parsed = normalize(parsed);
    generatedDistributionList = normalize(generatedDistributionList);
    const keys1 = Object.keys(parsed);
    const keys2 = Object.keys(generatedDistributionList);
    return (
      keys1.length === keys2.length &&
      keys1.every(key => parsed[key] === generatedDistributionList[key])
    );
  }
}

const distribution = new Distribution();
module.exports = {
  distribution,
};
