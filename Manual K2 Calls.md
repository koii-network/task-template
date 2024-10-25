# GUIDE TO CALLS K2 FUNCTIONS MANUALLY

If you wish to do the development by avoiding the timers then you can do the intended calls to K2 directly using these function calls.

To disable timers please set the TIMERS flag in task-node ENV to disable

NOTE : K2 will still have the windows to accept the submission and audit values, so you are expected to make calls in the intended slots of your round time.

## Get the task state

```js
console.log(await namespaceWrapper.getTaskState());
```

## Get round

```js
const round = await namespaceWrapper.getRound();
console.log("ROUND", round);
```

## Call to do the work for the task

```js
import { taskRunner } from "@_koii/task-manager";
await taskRunner.task();
```

## Submission to K2

Preferably you should submit the CID received from IPFS.

```js
import { taskRunner } from "@_koii/task-manager";
await taskRunner.submitTask(round - 1);
```

## Audit submissions

```js
import { taskRunner } from "@_koii/task-manager";
await taskRunner.auditTask(round - 1);
```

## Upload distribution list to K2

```js
import { taskRunner } from "@_koii/task-manager";
await taskRunner.selectAndGenerateDistributionList(10);
```

## Audit distribution list

```js
import { taskRunner } from "@_koii/task-manager";
await coreLogic.auditDistribution(round - 2);
```

## Payout trigger

```js
const responsePayout = await namespaceWrapper.payoutTrigger();
console.log("RESPONSE TRIGGER", responsePayout);
```

## Logs to be displayed on desktop-node

```js
namespaceWrapper.logger("error", "Internet connection lost");
await namespaceWrapper.logger("warn", "Stakes are running low");
await namespaceWrapper.logger("log", "Task is running");
```
