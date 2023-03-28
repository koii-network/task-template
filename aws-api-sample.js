const AWS = require('aws-sdk');

async function createAndStartInstance() {
  // Configure the AWS SDK with your credentials and region
  AWS.config.update({ region: 'us-west-2' });

  // Create an EC2 service object
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

  // Create the instance params
  const instanceParams = {
    ImageId: 'ami-0c94855ba95c71c99',
    InstanceType: 't2.micro',
    KeyName: 'my-key-pair',
    MinCount: 1,
    MaxCount: 1,
    SecurityGroupIds: ['sg-0123456789abcdefg'],
    SubnetId: 'subnet-0123456789abcdefg',
    UserData: 'IyEvYmluL2Jhc2gKCnNlcnZlcgo=' // Base64-encoded script to run on startup
  };

  // Create the instance
  const data = await ec2.runInstances(instanceParams).promise();
  const instanceId = data.Instances[0].InstanceId;

  console.log(`Created instance ${instanceId}`);

  // Wait until the instance is running
  await ec2.waitFor('instanceRunning', { InstanceIds: [instanceId] }).promise();

  console.log(`Instance ${instanceId} is now running`);

  return instanceId;
}


function runTest () {
  // first, create and start the instance
  let instance = createAndStartInstance();

  /* then, inject the bash script to 
      1. create a new user account
      2. install the dependencies
      3. run the docker container or executables
      4. load and configure local keys or certificates
      5. distribute shards of the key for the new user to known trusted nodes
      6. delete the original user account
  */
  // note: a sample of this script is stored in bash-after-launch.sh, but will need to be modified according to your use case

  // then, fetch the IP Address of the node
  let ip = fetchIpAddress(instance);

  // finally, start a watcher script and stake tokens on behalf of this new node along with it's IP address
}

const fetchIpAddress(instanceId) {
  // Configure the AWS SDK with your credentials and region
  AWS.config.update({ region: 'us-west-2' });
  
  // Create an EC2 service object
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });

  // Create the instance params
  const instanceParams = {
    InstanceIds: [instanceId]
  };

  // Create the instance
  const data = await ec2.describeInstances(instanceParams).promise();
  const ip = data.Reservations[0].Instances[0].PublicIpAddress;
  
  return ip;
}