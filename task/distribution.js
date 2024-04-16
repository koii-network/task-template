const { namespaceWrapper } = require('../_koiiNode/koiiNode');

class Distribution {
  /**
   * Generates and submits the distribution list for a given round
   * @param {number} round - The current round number
   * @returns {void}
   *  
  */
  submitDistributionList = async round => {
    console.log('SUBMIT DISTRIBUTION LIST CALLED WITH ROUND', round);
    try {
      const distributionList = await this.generateDistributionList(round);
      const decider = await namespaceWrapper.uploadDistributionList(
        distributionList,
        round,
      );
      console.log('DECIDER', decider);
      if (decider) {
        const response = await namespaceWrapper.distributionListSubmissionOnChain(round);
        console.log('RESPONSE FROM DISTRIBUTION LIST', response);
      }
    } catch (err) {
      console.log('ERROR IN SUBMIT DISTRIBUTION', err);
    }
  }
  /**
    * Audits the distribution list for a given round
    * @param {number} roundNumber - The current round number
    * @returns {void}
    *  
  */
  async auditDistribution(roundNumber) {
    console.log('AUDIT DISTRIBUTION CALLED WITHIN ROUND: ', roundNumber);
    await namespaceWrapper.validateAndVoteOnDistributionList(this.validateDistribution, roundNumber);
  }
  /** 
   * Generates the distribution list for a given round in your logic
   * @param {number} round - The current round number
   * @returns {Promise<object>} The distribution list for the given round
   */
  async generateDistributionList(round, _dummyTaskState) {
    try {
      distributionList = { 'EZeySfhSnM43g21jy1ndhWyv8x2rHQVFsogC6vTKgmYR': 10000000000 } 
      return distributionList;
    } catch (err) {
      console.log('ERROR IN GENERATING DISTRIBUTION LIST', err);
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
        fetchedDistributionList = _dummyDistributionList;
      } else {
        fetchedDistributionList = JSON.parse(rawDistributionList);
      }
      console.log('FETCHED DISTRIBUTION LIST', fetchedDistributionList);
      const generateDistributionList = await this.generateDistributionList(
        round,
        _dummyTaskState,
      );
      // Compare distribution list
      const parsed = fetchedDistributionList;
      console.log('COMPARE DISTRIBUTION LIST', parsed, generateDistributionList);
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
   * @param {object} generateDistributionList - The second object
   * @returns {boolean} The result of the comparison
   */
  async shallowEqual(parsed, generateDistributionList) {
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }

    // Normalize key quote usage for generateDistributionList
    generateDistributionList = JSON.parse(
      JSON.stringify(generateDistributionList),
    );

    const keys1 = Object.keys(parsed);
    const keys2 = Object.keys(generateDistributionList);
    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (parsed[key] !== generateDistributionList[key]) {
        return false;
      }
    }
    return true;
  }
}

const distribution = new Distribution();
module.exports = {
  distribution,
};
