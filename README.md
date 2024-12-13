# Koii Task Template

## Koii Task Development: Step-by-Step Guide

This guide will help you create, test, and deploy a task on the Koii Network. It's designed for beginners and experts alike. Read through the steps below for a simple, easy-to-follow guide.

*Want to dive deeper?* Check out our tutorialized [Development Guide](https://github.com/koii-network/ezsandbox).

## 1. Prerequisites

Before you begin, make sure you have the following:

### Tools to Install

- **Node.js** *(version >=20.0.0, LTS Versions only)*: [Download here](https://nodejs.org)
- *(Optional, for Python and Docker tasks only)* **Docker Compose**: [Install here](https://docs.docker.com/get-started/08_using_compose/)

## 2. Set Up Your Task

Once you have the required tools, input the following commands:

1. Clone the Koii Task Template:
   ```sh
   git clone https://github.com/koii-network/task-template.git
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

3. Navigate to the `src/task/1-task.js` file.

Now, let's begin writing a task!

## 3. Write Your Core Task Logic

The `src/task/1-task.js` file is where you will write all the code. It covers:

1. Defining task behavior
2. Handling inputs and outputs
3. Core logic error handling

We suggest you follow our tutorialized [Development Guide](https://github.com/koii-network/ezsandbox) for a more in-depth walkthrough. To keep things short, import the packages you require and write your core logic within the 'try-catch' statement.

To test your core logic, you can run the following command:

```sh
yarn test
```

This function will run your `src/task/1-task.js` file in a vacuum to quickly get your core logic into a working state. Use this function to test your UI and data postback to ensure your logic works as intended.

## 4. (Optional) Incentive Engineering

This step is optional, as nodes can run your task without incentives, but if you intend to distribute rewards for your task, consider adding audits.

Beyond your core logic in the `1-task.js` file, there are 5 other task files within this template:

- `src/task/0-setup.js`: For defining steps executed once before your task starts.
- `src/task/2-submission.js`: For defining how your task submits proofs for auditing.
- `src/task/3-audit.js`: For defining a function that audits the work done in your task function.
- `src/task/4-distribution.js`: For defining your incentive distribution logic.
- `src/task/5-routes.js`: For defining custom routes.

Find more info in our tutorialized [Development Guide](https://github.com/koii-network/ezsandbox).

To test a [full round cycle](https://docs.koii.network/gradual-consensus), use the following command:

```sh
yarn simulate
```

This command simulates the entire task flow, including performing the task, submitting results, and auditing work. It handles multiple task rounds, tracks step durations, and shows performance results and errors.

## 5. Production Testing

Before deploying your task to a production environment, test it in the Desktop Node:

1. Build your executable:
   ```sh
   yarn webpack
   ```

2. Create your `.env` file by renaming `.env.developer.example` to `.env`. Note: This file is for testing purposes only and does not reflect the env variables in your fully deployed task.

3. Add the "EZ Sandbox Task" to your desktop node using the EZ Sandbox Task ID (`BXbYKFdXZhQgEaMFbeShaisQBYG1FD4MiSf9gg4n6mVn`) and the Advanced option in the Add Task tab. [Click here for a detailed walkthrough of adding this task to the node.](https://github.com/koii-network/ezsandbox/tree/main/Get%20Started%20-%20Quick%20Intro).

4. Test your task in the production environment. To test your executable, enter the following command:
   ```sh
   yarn prod-debug
   ```
   The production debugger (prod-debug) launches nodemon, which automatically restarts your task whenever it detects changes in the source files, making production development faster and easier.

## 6. Production Deployment

1. Fill in your `config-task.yml`: 
   The default `config-task.yml` file has placeholders to fill in before deploying your task. This file configures your task with a name, an image, and other settings. Check the comments in the `config-task.yml` file for more information. Set the environment parameter in your config to "PRODUCTION".

2. Run the Create Task CLI: 
   The Create-Task-CLI is a command-line tool that helps you easily deploy your task so the Koii Community can host it on their nodes. To get started, copy the command below to your CLI:
   ```sh
   npx @_koii/create-task-cli@latest
   ```
   The Create-Task-CLI will ask for a series of inputs to help you deploy your task.

   *Note*: You may be asked for specific paths to your wallets. If you don't have a wallet yet, create one using the [Desktop Node](https://koii.network/node) or the [Koii CLI](https://docs.koii.network/develop/command-line-tool/koii-cli/install-cli).

   If the tool isn't able to grab these automatically, the OS-specific paths are:

   **Windows:** `/Users/<username>/AppData/Roaming`

   **Mac:** `/Users/<username>/Library/Application Support`

   **Linux:** `/home/<username>/.config`

   Once done, it will generate a task-ID, which will look something like "<BXbYKFdXZhQgEaMFbeShaisQBYG1FD4MiSf9gg4n6mVn>". [Add this task to your node as you did with the EZ Sandbox Task.](https://github.com/koii-network/ezsandbox/tree/main/Get%20Started%20-%20Quick%20Intro)

*Congrats! You've done it! You're now officially a blockchain developer with a decentralized app/service live in Web3. We couldn't be more proud!*

# More Info

## Task Flow

Tasks operate within a periodic structure known as 'rounds'. Each round consists of the following steps:

1. **Perform the Task:** Execute the necessary actions for the round.
2. **Audit Work:** Review the work completed by other nodes.
3. **Rewards and Penalties:** Distribute rewards and apply penalties as needed.

For more detailed information about the task flow, refer to [the runtime flow documentation](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus).

Looking to bring better structure to your task? Explore our [Task Organizer](https://www.figma.com/community/file/1220194939977550205/Task-Outline) for better organization.

## Tips

- Always ensure your secret files, such as `.env` files, are secure! Implement a robust `.gitignore` strategy.

**Advanced Runtime Options**

There are two ways to run your task during development:

1. With `GLOBAL_TIMERS="true"` (refer to `.env.local.example`) - When enabled, IPC calls are made by calculating the average time slots of all tasks running on your node.

2. With `GLOBAL_TIMERS="false"` - This option allows for manual calls to the K2 and disables automatic triggers for round management on K2. Transactions are only accepted during the correct time period. Instructions for manual calls can be found in [Manual K2 Calls](./Manual%20K2%20Calls.md).

**If you encounter any issues, don't hesitate to reach out by opening a ticket on [Discord](https://discord.gg/koii-network).**