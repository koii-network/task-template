# Test code for linktree task

Under test folder, you will find several files that are used for testing the task. The most important file is `unitTest.js`. This file is used to test the core logic functions of the task. The file contains a set of test cases that can be used to test the core logic functions. 

# Testing Steps Locally

1. Run `yarn install` to install all the dependencies. Node version 18.0.0 or higher is required.
2. Run `node test_submitlinktree.js` to submit the test data to the local. The test data is in `test_submitLinktree`. You can customize the test data to fit your task logic.
3. Now you have some linktree data stored locally, you can use `test_demodle.js` to check your local data.
 - Use `dbmodel.getLinktree(PublicKey)` to get the specific data by Public Key, which you can find in the `test_submitLinktree`.
 - Use `dbmodel.getAllLinktrees();` to get all the data.
4. Run `node unitTest.js` to start your test. The file contains a set of test cases that can be used to test the core logic functions. You can customize the test cases to fit your task logic.

    - `coreLogic.task()`
    It will run the main task logic `linktree_task.js` and return the result. This function will upload your local data as proof to IPFS and generate a CID. The result will be the cid that contain your proofs and signature. To run this you need check around `linktree_task.js`, uncommon the line:21 and common the line:18. Then in `coreLogic.js` uncommon the line: 20 and common the line: 17. This will make the task logic run on your local data.

    The final return would be looks like: _User Linktrees proof uploaded to IPFS:  bafybeibd2l3tkncg6p3mehjycjm7sejky5nny46ilxczosoj_

    - `coreLogic.fetchSubmission()`
    It will fetch the submission from IPFS and return the result. Usually work with `coreLogic.task()` to test the task logic. The submission will be a proof of nodes with signature. To run this you need check around `coreLogic.js` uncommon the line: 41 and common the line: 42. This will make the task logic run on your local data.

    The final return would be looks like: _Linktree proofs CID bafybeibd2l3tkncg6p3mehjycjm7sejky5nny46ilxczosoj in round 1000_

    - `coreLogic.validateNode()`
    It will validate your proofs from last step and return boolean `true` or `false`.

    - `coreLogic.generateDistributionList` and `coreLogic.validateDistribution`. In case you do not want to run the `task()` and `fetchsubmission()` again, you can uncommon line:15 and `let vote = true` to directly run the test. You can use example task state to test your proofs validation. Uncommon line:71 - line:85 to test thess functions. If the `vote` return true it will run the `generateDistributionList` and `validateDistribution` functions. The final return would be looks like: _RESULT true_

## unitTest.js

This file is used to test the core logic functions of the task. The file contains a set of test cases that can be used to test the core logic functions.

- `coreLogic.task()`
    It will run the task logic and return the result. The result will be a proof of nodes with signature and upload the proofs to IPFS. After that it will return the cid, which is used to test the other core logic functions.

- `coreLogic.fetchSubmission()`
    It will fetch the submission from IPFS and return the result. Usually work with `coreLogic.task()` to test the task logic. The submission will be a proof of nodes with signature.

- `coreLogic.validateNode()`
    It will validate the submission and return the result. Usually work with `coreLogic.fetchSubmission()` to test the submission logic. If you do not want to upload to IPFS and fetch from IPFS, you can hardcode the `submission` as the cid variable to test the validate logic.

- `coreLogic.generateDistributionList()`
    It will generate the distribution list and return the result. Usually work with `coreLogic.validateNode()` to test the distribution logic. You can also use example data to test the distribution logic.

To run the specific test case, you can common out the other test cases and run the specific test case.

## check_task-status.js

This file is used to check the task status. It will check the task status and return the result. The result will be the task status that running on the K2.

## test_cidValidation.js

This file is used to test the cid validation. It will validate the cid and return the result. The result will be the boolean of validation.
It has two test cases:
- `verifyNode`
- `verifyLinktree`
It will validate by using module `nacl` to check the signature of the proof. If the signature is valid, it will return true. Otherwise, it will return false.

## test_dbmodel.js

This file is used to test the database model. You can customize the database model to fit your task logic. The file contains a set of test cases that can be used to test the database model.

 - `dbmodel.getLinktree(PublicKey)`
 - `dbmodel.getAllLinktrees();`
 - `dbmodel.setLinktree(PublicKey, data);`
 - ...

Check `db_model.js` for more details that you can test on. Include linktree, proofs, node_proofs and authlist.

## test_docker_submitlinktree.js

Use this file to send test data to the K2. It will send the test data to the K2 and return the result. The post url format is `<nodeurl>/task/<taskID>/<endpoint>`. (You do not need to change this). If you need more information about other nodes url, you can check `check_task-status.js`, get the return and check `ip_address_list`.
To check the data you just submistted, you can use `test_endpoint.js`.

## test_endpoint.js

Use this file to test the GET endpoint. It will call the nodes endpoint and return the result. The endpoint url format is `<nodeurl>/task/<taskID>/<endpoint>`.

For example: use `https://k2-tasknet.koii.live/task/HjWJmb2gcwwm99VhyNVJZir3ToAJTfUB4j7buWnMMUEP/linktree/list` to get the list of linktree.

- 


