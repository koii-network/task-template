# Prometheus Task Template 🚀

## Project Overview

Prometheus is a highly extensible, modular task template designed for building scalable and efficient decentralized applications (dApps) on the Koii Network. This template provides a robust starting point for developers looking to create innovative blockchain-powered solutions with minimal initial setup.

### 🌟 Key Features
- TypeScript-based development environment
- Comprehensive task lifecycle management
- Built-in testing and simulation frameworks
- Flexible configuration options
- Docker and CI/CD support
- Best practices for web3 task development

## Getting Started

### Prerequisites
- **Node.js** *(version >=20.0.0, LTS Versions)*
- **Yarn** package manager
- *(Optional)* Docker Compose

### Installation Steps

1. Clone the Prometheus Task Template:
   ```bash
   git clone https://github.com/your-org/prometheus-task-template.git
   cd prometheus-task-template
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.developer.example .env
   ```

4. Run initial tests:
   ```bash
   yarn test
   ```

## Customization Guide

### Core Task Logic
The primary customization occurs in these key files:
- `src/task/1-task.ts`: Define your core task logic
- `src/task/0-setup.ts`: Set up initial task configurations
- `src/task/2-submission.ts`: Create submission strategies
- `src/task/3-audit.ts`: Implement audit mechanisms
- `src/task/4-distribution.ts`: Design reward distribution

### Renaming and Rebranding
1. Update `package.json` with your project details
2. Modify `config-task.yml` with specific task parameters
3. Adjust TypeScript configurations in `tsconfig.json`

## Project Structure

```
prometheus-task-template/
├── src/
│   └── task/                # Task implementation modules
│       ├── 0-setup.ts       # Initial task setup
│       ├── 1-task.ts        # Core task logic
│       ├── 2-submission.ts  # Result submission strategy
│       ├── 3-audit.ts       # Work verification
│       ├── 4-distribution.ts# Reward distribution
│       └── 5-routes.ts      # Custom API routes
├── tests/                   # Testing framework
├── .env.developer.example   # Environment configuration template
├── docker-compose.yaml      # Container orchestration
├── webpack.config.js        # Build configuration
└── config-task.yml          # Task deployment settings
```

## Technologies Used

### Core Technologies
- TypeScript
- Node.js
- Webpack
- Jest (Testing)
- ESLint & Prettier
- Docker

### Blockchain & Web3
- Koii Network
- K2 Blockchain
- Gradual Consensus Mechanism

## Use Cases

This template is ideal for:
- Decentralized computing tasks
- Oracles and data verification
- Distributed computing solutions
- Incentivized network services
- Blockchain-powered microservices

## Development Workflow

1. Write task logic in `src/task/1-task.ts`
2. Configure task parameters in `config-task.yml`
3. Test locally:
   ```bash
   yarn test      # Run unit tests
   yarn simulate  # Simulate full task round
   ```
4. Build for production:
   ```bash
   yarn webpack   # Create executable
   yarn prod-debug
   ```

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

Please ensure your code passes all tests and follows project conventions.

## License

This project is licensed under the MIT License. See `LICENSE` file for details.

## Support

Join our [Discord Community](https://discord.gg/koii-network) for support and discussions.

---

*Developed with ❤️ by the Prometheus Task Template Team*