const express = require('express');
const { coreLogic } = require('./coreLogic');
const { namespaceWrapper, taskNodeAdministered, app } = require('@_koii/namespace-wrapper');
const winston = require('winston');

// Set up logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
  ],
});

if (app) {
  // Middleware to handle JSON requests
  app.use(express.json());

  // Endpoint to return task state
  app.get('/taskState', async (req, res) => {
    try {
      const state = await namespaceWrapper.getTaskState();
      logger.info('TASK STATE', { state });
      res.status(200).json({ taskState: state });
    } catch (error) {
      logger.error('Error fetching task state', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Endpoint to return value stored in NeDB
  app.get('/value', async (req, res) => {
    try {
      const value = await namespaceWrapper.storeGet('value');
      logger.info('VALUE', { value });
      res.status(200).json({ value });
    } catch (error) {
      logger.error('Error fetching value', { error });
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}

async function setup() {
  /*######################################################
  ################## DO NOT EDIT BELOW #################
  ######################################################*/
  try {
    await namespaceWrapper.defaultTaskSetup();
  } catch (error) {
    logger.error('Error during task setup', { error });
    process.exit(1); // Exit the process if setup fails
  }

  process.on('message', async (m) => {
    logger.info('Received message', { message: m });

    switch (m.functionCall) {
      case 'submitPayload':
        logger.info('submitPayload called');
        await coreLogic.submitTask(m.roundNumber);
        break;
      case 'auditPayload':
        logger.info('auditPayload called');
        await coreLogic.auditTask(m.roundNumber);
        break;
      case 'executeTask':
        logger.info('executeTask called');
        await coreLogic.task(m.roundNumber);
        break;
      case 'generateAndSubmitDistributionList':
        logger.info('generateAndSubmitDistributionList called');
        await coreLogic.selectAndGenerateDistributionList(m.roundNumber, m.isPreviousRoundFailed);
        break;
      case 'distributionListAudit':
        logger.info('distributionListAudit called');
        await coreLogic.auditDistribution(m.roundNumber);
        break;
      default:
        logger.warn('Unknown function call', { functionCall: m.functionCall });
    }
  });
  /*######################################################
  ################ DO NOT EDIT ABOVE ###################
  ######################################################*/
}

// Initialize the setup
setup().catch(error => {
  logger.error('Setup failed', { error });
  process.exit(1);
});
