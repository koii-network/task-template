const coreLogic = require('../coreLogic');
const index = require('../index');

async function test_coreLogic() {
  await coreLogic.task();
  const submission = await coreLogic.fetchSubmission();
  const vote = await coreLogic.validateNode(submission, 1);

  const _dummyTaskState = {
    submissions: {
      1: {
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cd',
          slot: 1889700,
          round: 1,
        },
      },
      1: {
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          submission_value: '34976272f8acef2758e794a0a8ef0032299e4339',
          slot: 1890002,
          round: 1,
        },
      },
    },
    submissions_audit_trigger: {},
  };
  if (vote == true) {
    console.log('Submission is valid, generating distribution list');
    const distributionList = await coreLogic.generateDistributionList(
      1,
      _dummyTaskState,
    );
    await coreLogic.validateDistribution(
      null,
      1,
      distributionList,
      _dummyTaskState,
    );
  } else {
    console.log('Submission is invalid, not generating distribution list');
  }
}

test_coreLogic();
