const coreLogic = require('../coreLogic');
const index = require('../index');

async function test_coreLogic() {
  await coreLogic.task();
  const submission = await coreLogic.fetchSubmission();
  console.log(submission)
  // const vote = await coreLogic.validateNode(submission, 1);
  let vote = true;
  const _dummyTaskState = {
    submissions: {
      1: {
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cd',
          slot: 1889700,
          round: 1,
        },
        '2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH': {
          submission_value: '8164bb07ee54172a184bf35f267bc3f0052a90cc',
          slot: 1890002,
          round: 1,
        },
      },
    },
    submissions_audit_trigger: {
      "1":{ // round number
        "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL":{ // Data Submitter (send data to K2)
            "trigger_by":"2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH", // Audit trigger
            "slot":1890002,
            "votes":[{
                "is_valid": false, // Submission is invalid(Slashed)
                "voter":"2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ", // Voter
                "slot":1890003
            }]
        },
        "2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHH":{ // Data Submitter (send data to K2)
          "trigger_by":"2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHL", // Audit trigger
          "slot":1890002,
          "votes":[{
              "is_valid": false, // Submission is invalid(Slashed)
              "voter":"2NstaKU4kif7uytmS2PQi9P5M5bDLYSF2dhUNFhJbxHZ", // Voter
              "slot":1890003
          }]
      }
    }
    },
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
