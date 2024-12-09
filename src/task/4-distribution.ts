// Define the percentage by which to slash the stake of submitters who submitted incorrect values
// 0.7 = 70%
import { Submitter, DistributionList } from "@_koii/task-manager";
const SLASH_PERCENT = 0.7;

export function distribution(
  submitters: Submitter[],
  bounty: number,
  roundNumber: number,
): DistributionList {
  /**
   * Generate the reward list for a given round
   * This function should return an object with the public keys of the submitters as keys
   * and the reward amount as values
   */
  console.log(`MAKE DISTRIBUTION LIST FOR ROUND ${roundNumber}`);
  const distributionList: DistributionList = {};
  const approvedSubmitters = [];
  // Slash the stake of submitters who submitted incorrect values
  // and make a list of submitters who submitted correct values
  for (const submitter of submitters) {
    if (submitter.votes === 0) {
      distributionList[submitter.publicKey] = 0;
    } else if (submitter.votes < 0) {
      const slashedStake = submitter.stake * SLASH_PERCENT;
      distributionList[submitter.publicKey] = -slashedStake;
      console.log("CANDIDATE STAKE SLASHED", submitter.publicKey, slashedStake);
    } else {
      approvedSubmitters.push(submitter.publicKey);
    }
  }
  if (approvedSubmitters.length === 0) {
    console.log("NO NODES TO REWARD");
    return distributionList;
  }
  // reward the submitters who submitted correct values
  const reward = Math.floor(bounty / approvedSubmitters.length);
  console.log("REWARD PER NODE", reward);
  approvedSubmitters.forEach((candidate) => {
    distributionList[candidate] = reward;
  });
  return distributionList;
}
