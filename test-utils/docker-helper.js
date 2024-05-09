const fs = require('fs');
const dotenv = require('dotenv');
const { spawn } = require('child_process');

dotenv.config();

const numberOfNodes = process.env.NUMBER_OF_NODES;

const basePort = 30017;
const baseRpcPort = 10000;
const commands = [
    "koii config set --url localhost",
    "koii-keygen new -o koii/id.json",
    "koii airdrop 10000 --keypair koii/id.json"
  ];
let services = '';


for (let i = 1; i <= numberOfNodes; i++) {
  const servicePort = basePort + i;
  const rpcPort = baseRpcPort + i;
  services += `
  task_node_${i}:
    image: public.ecr.aws/koii-network/task_node:latest
    command: yarn initialize-start
    extra_hosts:
      - "host.docker.internal:host-gateway"
    ports:
      - ${servicePort}:${basePort}
      - ${rpcPort}:${baseRpcPort}
    env_file: ./temp/.env.local${i}
    container_name: task_node_${i}
    volumes:
      - ./temp/tasknode${i}/koii:/app/config
      - ./temp/tasknode${i}/data:/app/data
      - ./temp/tasknode${i}/namespace:/app/namespace
      - ../dist:/app/executables
`;
}

console.log(services);
const dockerComposeTemplate = `version: '3.2'
services:${services}
`;


fs.writeFile('docker-compose.yaml', dockerComposeTemplate, err => {
  if (err) {
    console.error('Error writing docker-compose file:', err);
  } else {
    console.log('docker-compose.yml file has been created successfully.');
  }
});

function executeCommandInDirectory(directory, command, args) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, { cwd: directory, stdio: ['pipe', 'pipe', 'pipe'] });
  
      proc.stdout.on('data', data => {
        console.log(`stdout: ${data}`);
      });
  
      proc.stderr.on('data', data => {
        console.error(`stderr: ${data}`);
      });
  
      proc.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      if (command.includes("koii-keygen")) {
        proc.stdin.write('\n'); 
        proc.stdin.end();      
      }
    });
  }

  (async () => {
    for (let i = 1; i <= numberOfNodes; i++) {
      const nodeDir = `./temp/tasknode${i}`;

      if (!fs.existsSync(nodeDir)) {
        fs.mkdirSync(nodeDir, { recursive: true });
      }
  
      try {
        console.log(`Processing node ${i} in directory ${nodeDir}`);
        await executeCommandInDirectory(nodeDir, 'koii', ['config', 'set', '--url', 'localhost']);
        await executeCommandInDirectory(nodeDir, 'koii-keygen', ['new', '-o', 'koii/id.json']);
        await executeCommandInDirectory(nodeDir, 'koii', ['airdrop', '10000', '--keypair', 'koii/id.json']);
        console.log(`Commands completed for node ${i}`);
      } catch (error) {
        console.error(`Error processing node ${i}: ${error.message}`);
      }
    }
  })();



const createEnvContent = (index) => {
  return `
  ######################################################
  ################## DO NOT EDIT BELOW #################
  ######################################################
  # Location of main wallet Do not change this, it mounts the ~/.config/koii:/app/config if you want to change, update it in the docker-compose.yml
  WALLET_LOCATION="/app/config/id.json"
  # Node Mode
  NODE_MODE="service"
  # The nodes address
  SERVICE_URL="http://task_node_${index}:30017"
  # Intial balance for the distribution wallet which will be used to hold the distribution list. 
  INITIAL_DISTRIBUTION_WALLET_BALANCE= 2
  # Global timers which track the round time, submission window and audit window and call those functions
  GLOBAL_TIMERS="true"
  # HAVE_STATIC_IP is flag to indicate you can run tasks that host APIs
  # HAVE_STATIC_IP=true
  # To be used when developing your tasks locally and don't want them to be whitelisted by koii team yet
  RUN_NON_WHITELISTED_TASKS=true
  # The address of the main trusted node
  # TRUSTED_SERVICE_URL="https://k2-tasknet.koii.live"
  # For the purpose of automating the staking wallet creation, the value must be greater 
  # than the sum of all TASK_STAKES, the wallet will only be created and staking on task 
  # will be done if it doesn't already exist
  INITIAL_STAKING_WALLET_BALANCE=100
  
  # environment
  ENVIRONMENT="IPFS"
  
  # If you are running a koii-test-validator use http://127.0.0.1:8899 (linux) otherwise use http://host.docker.internal:8899 for Mac and Windows
  # Location of K2 node
  K2_NODE_URL="${process.env.VALIDATOR_URL}"
  
  # Tasks to run and their stakes. This is the varaible you can add your Task ID to after
  # registering with the crete-task-cli. This variable supports a comma separated list:
  # TASKS="id1,id2,id3"
  # TASK_STAKES="1,1,1"
  TASKS="${process.env.TASK_ID}"
  TASK_STAKES=5
  
  # User can enter as many environment variables as they like below. These can be task
  # specific variables that are needed for the task to perform it's job. Some examples:
  Spheron_Storage=""
  SCRAPING_URL="https://www.baidu.com"
  HAVE_STATIC_IP=true  
  VALUE="herman"
  `;
};

for (let i = 1; i <= numberOfNodes; i++) {
  const filePath = `./temp/.env.local${i}`;
  const content = createEnvContent(i);
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}
