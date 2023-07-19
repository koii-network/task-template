const { namespaceWrapper } = require('./_koiiNode/koiiNode');

const {
  task,
  fetchSubmission,
  submitTask,
} = require('./submission/submission.js');

const {
  generateDistributionList,
  submitDistributionList,
} = require('./distribution/distribution.js');

const {
  validateNode,
  validateDistribution,
  auditTask,
  auditDistribution,
} = require('./audit/audit.js');

class CoreLogic {
  constructor() {
    this.task = task;
    this.fetchSubmission = fetchSubmission;
    this.submitTask = submitTask;
    this.generateDistributionList = generateDistributionList;
    this.submitDistributionList = submitDistributionList;
    this.validateNode = validateNode;
    this.validateDistribution = validateDistribution;
    this.auditTask = auditTask;
    this.auditDistribution = auditDistribution;
  }
}
const coreLogic = new CoreLogic();

module.exports = { coreLogic };
