const { namespaceWrapper } = require('../_koiiNode/koiiNode');

async function shallowEqual(object1, object2) {
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

async function validateNode(submission_value, round) {
  let vote;
  console.log('SUBMISSION VALUE', submission_value, round);

  try {
    if (submission_value == 'Hello, World!') {
      vote = true;
    } else {
      vote = false;
    }
  } catch (e) {
    console.error(e);
    vote = false;
  }

  return vote;
}

async function auditTask(roundNumber) {
  console.log('auditTask called with round', roundNumber);
  console.log(
    await namespaceWrapper.getSlot(),
    'current slot while calling auditTask',
  );
  await namespaceWrapper.validateAndVoteOnNodes(validateNode, roundNumber);
}

async function auditDistribution(roundNumber) {
  console.log('auditDistribution called with round', roundNumber);
  await namespaceWrapper.validateAndVoteOnDistributionList(
    validateDistribution,
    roundNumber,
  );
}

async function validateDistribution(
  distributionListSubmitter,
  round,
  _dummyDistributionList,
  _dummyTaskState,
) {
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
    const generateDistributionList = await generateDistributionList(
      round,
      _dummyTaskState,
    );

    // compare distribution list

    const parsed = fetchedDistributionList;
    console.log('compare distribution list', parsed, generateDistributionList);
    const result = await shallowEqual(parsed, generateDistributionList);
    console.log('RESULT', result);
    return result;
  } catch (err) {
    console.log('ERROR IN VALIDATING DISTRIBUTION', err);
    return false;
  }
}

module.exports = {
  validateNode,
  validateDistribution,
  auditTask,
  auditDistribution,
};
