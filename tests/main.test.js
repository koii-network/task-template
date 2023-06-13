const { coreLogic } = require('../coreLogic');
const { _server } = require('../init');
const { namespaceWrapper } = require('../namespaceWrapper');

beforeAll(async () => {
  await namespaceWrapper.defaultTaskSetup();
});

describe('Performing the task', () => {
  it('should performs the core logic task', async () => {
    const result = await coreLogic.task();
    expect(result).not.toContain('ERROR IN EXECUTING TASK');
  });

  it('should fetch the submission', async () => {
    const result = await coreLogic.fetchSubmission();
    expect(result).toBeDefined();
    expect(result).not.toBeNaN();
  });

  it('should fetch the submission', async () => {
    const result = await coreLogic.fetchSubmission();
    expect(result).toBeDefined();
    expect(result).not.toBeNaN();
  });
  it('should make the submission to k2 for dummy round 1', async () => {
    const round = 1;
    const result = await coreLogic.submitTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    expect(taskState).toBeDefined();
    console.log(taskState);
    expect(taskState.submissions[round]).toBeDefined();

    expect(result).not.toBeNaN();
  });
});

afterAll(async () => {
  _server.close();
});
