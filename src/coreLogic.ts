import { submission, audit, distribution } from "../src/task";

const task = {
  submission,
  audit,
  distribution,
};

class CoreLogic {
  async task(round: number) {
    const result = await task.submission.task(round);
    return result;
  }

  async submitTask(round: number) {
    const submission = await task.submission.submitTask(round);
    return submission;
  }

  async auditTask(round: number) {
    await task.audit.auditTask(round);
  }

  async submitDistributionList(round: number) {
    await task.distribution.submitDistributionList(round);
  }

  async auditDistribution(round: number) {
    await task.distribution.auditDistribution(round);
  }
}

export const coreLogic = new CoreLogic();
