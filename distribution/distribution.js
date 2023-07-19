const { namespaceWrapper } = require('../_koiiNode/koiiNode');

async function generateDistributionList(round, _dummyTaskState) {
  try {
    console.log('GenerateDistributionList called');
    console.log('I am selected node');

    // Write the logic to generate the distribution list here by introducing the rules of your choice

    /*  **** SAMPLE LOGIC FOR GENERATING DISTRIBUTION LIST ******/

    let distributionList = {};
    let distributionCandidates = [];
    let taskAccountDataJSON = await namespaceWrapper.getTaskState();
    if (taskAccountDataJSON == null) taskAccountDataJSON = _dummyTaskState;
    const submissions = taskAccountDataJSON.submissions[round];
    const submissions_audit_trigger =
      taskAccountDataJSON.submissions_audit_trigger[round];
    if (submissions == null) {
      console.log(`No submisssions found in round ${round}`);
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

async function submitDistributionList(round) {
  // This function just upload your generated dustribution List and do the transaction for that

  console.log('SubmitDistributionList called');

  try {
    const distributionList = await generateDistributionList(round);

    const decider = await namespaceWrapper.uploadDistributionList(
      distributionList,
      round,
    );
    console.log('DECIDER', decider);

    if (decider) {
      const response = await namespaceWrapper.distributionListSubmissionOnChain(
        round,
      );
      console.log('RESPONSE FROM DISTRIBUTION LIST', response);
    }
  } catch (err) {
    console.log('ERROR IN SUBMIT DISTRIBUTION', err);
  }
}

module.exports = {
  generateDistributionList,
  submitDistributionList,
};
