const { coreLogic } = require('../coreLogic');
const { _server } = require('../init');
const { namespaceWrapper } = require('../namespaceWrapper');
const Joi = require('joi');

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
  it('should make the submission to k2 for dummy round 1', async () => {
    const round = 1;
    await coreLogic.submitTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    const schema = Joi.object().pattern(
      Joi.string(),
      Joi.object().pattern(
        Joi.string(),
        Joi.object({
          submission_value: Joi.string().required(),
          slot: Joi.number().integer().required(),
          round: Joi.number().integer().required(),
        })
      )
    ).required().min(1);;
    const validationResult = schema.validate(taskState.submissions);
    console.log(validationResult)
    try{
      expect(validationResult.error).toBeUndefined();
    }catch(e){
      throw new Error("Submission doesn't exist or is incorrect")
    }
  });

  it('should make the make an audit on submission', async () => {
    const round = 1;
    await coreLogic.auditTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    console.log("audit task",taskState.submissions_audit_trigger)
    const schema = Joi.object().pattern(
      Joi.string(),
      Joi.object().pattern(
        Joi.string(),
        Joi.object({
          trigger_by: Joi.string().required(),
          slot: Joi.number().integer().required(),
          votes: Joi.array().required(),
        })
      )
    ).required();;
    const validationResult = schema.validate(taskState.submissions_audit_trigger);
    console.log(validationResult)
    try{
      expect(validationResult.error).toBeUndefined();
    }catch(e){
      throw new Error("Submission doesn't exist or is incorrect")
    }
  });
});

afterAll(async () => {
  _server.close();
});
