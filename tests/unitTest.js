const coreLogic = require('../coreLogic');
const index = require('../index');
coreLogic.task();
const submission = coreLogic.fetchSubmission();
coreLogic.validateNode(submission, 1);

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
const distributionList = generateDistributionList(1, _dummyTaskState);
coreLogic.validateDistribution(null, 1, distributionList, _dummyTaskState);
