# K2-Task-Template


This is the new K2 Task Template which uses webpack to allow support of all node modules and project structures instead of single file executable for koii task. [WIP]

NamespaceWrappers contains the interacts to make an API call to the namespace function of task-node. It contains all the necessary functions required to submit, audit the work as well as the distribution lists 

Index file - You have two ways to run your task when doing development

1. With Timer ON (one of the environment variable in task-node)- When the timer is ON, IPC calls are made by calculating the average time slots of all the task running your node. 

2. With Timer OFF - This allows you to do manual calls to K2 instead of the automated one's with triggers but for using this make sure that you fully understand how the round managemnt is done on K2. Transactions are only accepted in a dedicated windows. Guide ffor manual calls is in index.js

The methods mentioned in index.js are based on the events that task-node triggeres. The core logic of which resides in coreLogic.js

There are in total 9 functions in CoreLogic which the you can modify according to your needs tweak : 

1. task() - The logic for what your task should do goes here. There is a window in round that is dedicated to do work. The code in task is executed in that window. 

2. fetchSubmission() - After completing the task , the results/work will be stored somewhere like on IPFS or local levelDB. This function is the place where you can write the logic to fetch that work. It is called in submitTask() function which does the actual submission on K2. 

3. submitTask() - It makes the call to namespace function of task-node using the wrapper. 

4. generateDistributionList()  - You have full freedom to prepare your reward distributions as you like and the logic for that goes here. We have provided a sample logic that rewards 1 KOII to all the needs who did the correct submission for that round. This function is called in submitDistributionList()

5. submitDistributionList() - makes call to the namesapce function of task-node to upload the list and on succesful upload does the transaction to update the state.

6. validateNode() - this function is called to verify the submission value, so based on the value received from the task-state we can vote on the submission.

7. validateDistribution() - The logic to validate the distribution list goes here and the function will receive the distribution list submitted form task-state.

8. auditTask() - makes call to namespace of task-node to raise an audit against the submission value if the validation fails. 

9. auditDistribution() - makes call to namespace of task-node to raise an audit against the distribution list if the validation fails.

If you intend to check the logic that you wrote in these function then just calls these coreLogic function index. 

Once you are ready with the changes you can do : yarn webpack 

This will make the single main.js file in dist. Your logic for main.js goes to the executable file in your task-node container. We suggest you to have a script that migrates your main.js to executable in task-node container and restarts it to reflect your changes. 
