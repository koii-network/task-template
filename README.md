# Koii Task Template

## Development Guide

First time writing a task? Start with the [Development Guide](https://github.com/koii-network/ezsandbox).

## Task Flow

Tasks operate within a periodic structure known as 'rounds'. Each round consists of the following steps:

1. **Perform the Task:** Execute the necessary actions for the round.
2. **Audit Work:** Review the work completed by other nodes.
3. **Rewards and Penalties:** Distribute rewards and apply penalties as necessary.

For more detailed information about the task flow, refer to [the runtime flow documentation](https://docs.koii.network/concepts/what-are-tasks/what-are-tasks/gradual-consensus).

Looking to bring better structure to your task? Explore our [Task Organizer](https://www.figma.com/community/file/1220194939977550205/Task-Outline) for better organization.

## Tips

- Always ensure your secret files, such as `.env` files, are secure! Implement a robust `.gitignore` strategy.
- Continue innovating with Koii!

Should you encounter any issues, don't hesitate to reach out by opening a ticket on [Discord](https://discord.gg/koii-network).

## Environment Requirements

- [Node >=16.0.0](https://nodejs.org)
- [Docker Compose](https://docs.docker.com/get-started/08_using_compose/)

## Tool Requirements

- [Koii CLI Suite](https://docs.koii.network/develop/command-line-tool/koii-cli/install-cli)
- [Create Task CLI](https://docs.koii.network/develop/command-line-tool/create-task-cli/install)

## Available Scripts

```sh
npm test
````

Simulate rounds using unitTest.js.

```sh
npm jest-test
````

Runs tests using Just.

```sh
npm run webpack
```

Builds the project and generates the main script: `dist/main.js`.

```sh
npm run prod-debug
```

Runs the live debugger (must have the task running in the desktop node).

## Runtime Options

There are two ways to run your task during development:

1. With `GLOBAL_TIMERS="true"` (refer to `.env.local.example`) - When this option is enabled, IPC calls are made by calculating the average time slots of all tasks running on your node.

2. With `GLOBAL_TIMERS="false"` - This option allows for manual calls to K2 and disables the automatic triggers for round management on K2. Transactions are only accepted during the correct time period. Instructions for manual calls can be found in `index.js`.
