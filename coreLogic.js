const task = require('./task');

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

  async submitDistributionList(round) {
    await task.distribution.submitDistributionList(round);
  }

  async auditDistribution(round) {
    await task.distribution.auditDistribution(round);
  }
}
const coreLogic = new CoreLogic();

module.exports = { coreLogic };
