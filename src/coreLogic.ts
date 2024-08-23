
import {audit, distribution,submission} from "./task"
import {namespaceWrapper} from "./_koiiNode/_koiiNode" 
const task = {
  audit,
  distribution,
  submission,
};
class CoreLogic {
  async task(round) {
    const result = await task.submission.task(round);
    return result;
  }

  async submitTask(round) {
    const submission = await task.submission.submitTask(round);
    return submission;
  }

  async auditTask(round) {
    await task.audit.auditTask(round);
  }

  async selectAndGenerateDistributionList(
    round,
    isPreviousRoundFailed = false,
  ) {
    await namespaceWrapper.selectAndGenerateDistributionList(
      task.distribution.submitDistributionList,
      round,
      isPreviousRoundFailed,
    );
  }

  async auditDistribution(round) {
    await task.distribution.auditDistribution(round);
  }
}
export const coreLogic = new CoreLogic();


