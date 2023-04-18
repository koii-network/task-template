const coreLogic = require('./coreLogic');
const dbSharing = require('./dbSharing');
// const localShim = require('./localTestingShim'); // TEST to enable testing with K2 without round timers, enable this line and line 59
const { app } = require('./init');
const express = require('express');
const { namespaceWrapper, taskNodeAdministered } = require('./namespaceWrapper');
const fs = require('fs');
const routes = require('./routes');

async function setup() {
  const originalConsoleLog = console.log;

  // Create a writable stream to the log file
  const logStream = fs.createWriteStream('./namespace/logs.txt', { flags: 'a' });

  // Overwrite the console.log function to write to the log file
  console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ') + '\n';

    // Write the message to the log file
    logStream.write(message);
  };

  console.log('setup function called');
  // Run default setup
  await namespaceWrapper.defaultTaskSetup();
  process.on('message', (m) => {
    console.log('CHILD got message:', m);
    if (m.functionCall == 'submitPayload') {
      console.log('submitPayload called');
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == 'auditPayload') {
      console.log('auditPayload called');
      coreLogic.auditTask(m.roundNumber);
    }
    else if(m.functionCall == 'executeTask') {
      console.log('executeTask called');
      coreLogic.task();
    }
    else if(m.functionCall == 'generateAndSubmitDistributionList') {
      console.log('generateAndSubmitDistributionList called');
      coreLogic.submitDistributionList(m.roundNumber);
    }
    else if(m.functionCall == 'distributionListAudit') {
      console.log('distributionListAudit called');
      coreLogic.auditDistribution(m.roundNumber);
    }
  });

  // Code for the data replication among the nodes
  setInterval(() => {
    dbSharing.share();
  }, 20000);

  // localShim(); // TEST enable this to run the localShim for testing with K2 without timers
}

if (taskNodeAdministered){
  setup();
}

if (app) {
  app.use(express.json());
  app.use('/', routes)
}