# Prometheus Task Template for Koii Network

## 🚀 Project Overview

This repository is a specialized Koii Network task template, designed to provide developers with a robust framework for creating and deploying decentralized computational tasks. Built with TypeScript, the Prometheus template offers a comprehensive structure for implementing blockchain-based distributed computing solutions.

### Key Characteristics
- 🔄 Task-based computational framework
- 💻 TypeScript-powered development environment
- 🌐 Koii Network integration
- 🛡️ Modular task architecture

## 🛠 Technologies Used

- **Programming Language**: TypeScript
- **Runtime**: Node.js (>=18.17.0)
- **Package Manager**: Yarn
- **Key Dependencies**:
  - `@_koii/task-manager`: Task management utilities
  - `@_koii/web3.js`: Web3 interaction library
  - `@_koii/namespace-wrapper`: Namespace management

## 📦 Project Structure

```
prometheus-task/
│
├── src/
│   ├── index.ts                 # Main entry point
│   └── task/
│       ├── 0-setup.ts           # Initial setup logic
│       ├── 1-task.ts            # Core task implementation
│       ├── 2-submission.ts      # Result submission handling
│       ├── 3-audit.ts           # Task auditing mechanism
│       ├── 4-distribution.ts    # Reward distribution logic
│       └── 5-routes.ts          # Custom route definitions
│
├── tests/                       # Testing utilities
│   ├── main.test.ts
│   ├── simulateTask.ts
│   └── testTask.ts
│
├── config-task.yml              # Task configuration
├── package.json                 # Project dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version >=18.17.0)
- Yarn package manager

### Installation Steps
1. Clone the repository
   ```bash
   git clone https://github.com/your-org/prometheus-task.git
   cd prometheus-task
   ```

2. Install dependencies
   ```bash
   yarn install
   ```

## 🔍 Key Features

- **Modular Task Architecture**: Separate modules for setup, core logic, submission, auditing, and distribution
- **Flexible Configuration**: Customizable task parameters via `config-task.yml`
- **Comprehensive Testing**: Built-in test scripts and simulation capabilities
- **TypeScript Support**: Strong typing and modern JavaScript features

## 💻 Development Commands

- `yarn start`: Launch development server
- `yarn test`: Run task test suite
- `yarn simulate`: Simulate full task round cycle
- `yarn webpack`: Build executable for production
- `yarn lint`: Run code linting
- `yarn format`: Automatically format code

## 🧪 Testing and Simulation

### Local Testing
```bash
# Run basic tests
yarn test

# Simulate full task round
yarn simulate
```

### Production Debugging
```bash
# Build and debug production executable
yarn webpack
yarn prod-debug
```

## 🌐 Deployment Process

1. Configure `config-task.yml` with your specific parameters
2. Use Koii's Create Task CLI for deployment
   ```bash
   npx @_koii/create-task-cli@latest
   ```

## 📋 Task Round Flow

Prometheus tasks follow a standard Koii Network round structure:
1. **Task Execution**: Perform computational work
2. **Submission**: Submit results for verification
3. **Auditing**: Community nodes validate submissions
4. **Distribution**: Rewards allocated based on performance

## 🔒 License

ISC License. See `LICENSE` file for complete details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues or questions, please open a GitHub issue or join the [Koii Network Discord](https://discord.gg/koii-network).

**Happy Decentralized Computing! 🌍🚀**