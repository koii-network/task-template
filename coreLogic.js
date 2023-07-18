const { namespaceWrapper } = require('./_koiiNode/koiiNode');
const crypto = require('crypto');
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

  async shallowEqual(object1, object2) {
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
}
const coreLogic = new CoreLogic();

module.exports = { coreLogic };
