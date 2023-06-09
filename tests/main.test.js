const { coreLogic } = require('../coreLogic');

describe('Performing the task', () => {
  it('should performs the core logic task', async () => {
    const result = await coreLogic.task();
    expect(result).not.toContain('ERROR IN EXECUTING TASK');
  });

  it('should fetch the submission', async() => {
    const result = await coreLogic.fetchSubmission();
    expect(result).toBeDefined();
    expect(result).not.toBeNaN();
  });
});
