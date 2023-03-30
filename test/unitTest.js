const coreLogic = require('../coreLogic');
const index = require('../index');
coreLogic.task();
const submission = coreLogic.fetchSubmission();
coreLogic.validateNode(submission, 1);
