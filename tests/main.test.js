import { initializeTaskManager, taskRunner } from "@_koii/task-manager";
import { setup } from "../src/task/0-setup.js";
import { task } from "../src/task/1-task.js";
import { submission } from "../src/task/2-submission.js";
import { audit } from "../src/task/3-audit.js";
import { distribution } from "../src/task/4-distribution.js";
import { routes } from "../src/task/5-routes.js";
import { Keypair } from "@_koii/web3.js";
import { namespaceWrapper, _server } from "@_koii/namespace-wrapper";
import Joi from "joi";
import axios from "axios";

beforeAll(async () => {
  await namespaceWrapper.defaultTaskSetup();
  initializeTaskManager({
    setup,
    task,
    submission,
    audit,
    distribution,
    routes,
  });
});

describe("Performing the task", () => {
  it("should performs the core logic task", async () => {
    const round = 1;
    await taskRunner.task(round);
    const value = await namespaceWrapper.storeGet("value");
    expect(value).toBeDefined();
    expect(value).not.toBeNull();
  });

  it("should make the submission to k2 for dummy round 1", async () => {
    const round = 1;
    await taskRunner.submitTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            submission_value: Joi.string().required(),
            slot: Joi.number().integer().required(),
            round: Joi.number().integer().required(),
          }),
        ),
      )
      .required()
      .min(1);
    const validationResult = schema.validate(taskState.submissions);
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Submission doesn't exist or is incorrect");
    }
  });

  it("should make an audit on submission", async () => {
    const round = 1;
    await taskRunner.auditTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    console.log("TASK STATE", taskState);
    console.log("audit task", taskState.submissions_audit_trigger);
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            trigger_by: Joi.string().required(),
            slot: Joi.number().integer().required(),
            votes: Joi.array().required(),
          }),
        ),
      )
      .required();
    const validationResult = schema.validate(
      taskState.submissions_audit_trigger,
    );
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Submission audit is incorrect");
    }
  });
  it("should make the distribution submission to k2 for dummy round 1", async () => {
    const round = 1;
    await taskRunner.submitDistributionList(round);

    const taskState = await namespaceWrapper.getTaskState();
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            submission_value: Joi.string().required(),
            slot: Joi.number().integer().required(),
            round: Joi.number().integer().required(),
          }),
        ),
      )
      .required()
      .min(1);
    console.log(
      "Distribution submission",
      taskState.distribution_rewards_submission,
    );
    const validationResult = schema.validate(
      taskState.distribution_rewards_submission,
    );
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Distribution submission doesn't exist or is incorrect");
    }
  });
  it("should make an audit on distribution submission", async () => {
    const round = 1;
    await taskRunner.auditDistribution(round);
    const taskState = await namespaceWrapper.getTaskState();
    console.log("audit task", taskState.distributions_audit_trigger);
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            trigger_by: Joi.string().required(),
            slot: Joi.number().integer().required(),
            votes: Joi.array().required(),
          }),
        ),
      )
      .required();
    const validationResult = schema.validate(
      taskState.distributions_audit_trigger,
    );
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Distribution audit is incorrect");
    }
  });

  it("should make sure the submitted distribution list is valid", async () => {
    const round = 1;
    const distributionList = await namespaceWrapper.getDistributionList(
      null,
      round,
    );
    console.log(
      "Generated distribution List",
      JSON.parse(distributionList.toString()),
    );
    const schema = Joi.object()
      .pattern(Joi.string().required(), Joi.number().integer().required())
      .required();
    const validationResult = schema.validate(
      JSON.parse(distributionList.toString()),
    );
    console.log(validationResult);
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Submitted distribution list is not valid");
    }
  });

  it("should test the endpoint", async () => {
    const response = await axios.get("http://localhost:3000");
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: "Running", status: 200 });
  });

  it("should generate a empty distribution list when submission is 0", async () => {
    const submitters = [];
    const bounty = Math.floor(Math.random() * 1e15) + 1;
    const roundNumber = Math.floor(Math.random() * 1e5) + 1;
    const distributionList = distribution(submitters, bounty, roundNumber);
    expect(distributionList).toEqual({});
  });

  it("should generate a distribution list contains all the submitters", async () => {
    const simulatedSubmitters = 10000;
    const submitters = [];
    // 10k is the rough maximum number of submitters
    for (let i = 0; i < simulatedSubmitters; i++) {
      const publicKey = `mockPublicKey${i}`; 
      submitters.push({
        publicKey,
        votes: Math.floor(Math.random() * simulatedSubmitters) - 5000, 
        stake: Math.floor(Math.random() * 1e9) + 1
      });
    }
    const bounty = Math.floor(Math.random() * 1e15) + 1;
    const roundNumber = 1;
    const distributionList = distribution(submitters, bounty, roundNumber);
    expect(Object.keys(distributionList).length).toBe(submitters.length);
    expect(Object.keys(distributionList).sort()).toEqual(submitters.map(submitter => submitter.publicKey).sort());

  });
});

afterAll(async () => {
  _server.close();
});
