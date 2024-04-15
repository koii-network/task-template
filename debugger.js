require('dotenv').config;

class Debugger {
  /*
  Create .env file with following variables or direclty input values to be used in live-debugging mode.
  */
  static webpackedFilePath = process.env.WEBPACKED_FILE_PATH || '';
  static destinationPath = process.env.DESTINATION_PATH || '';
  static keywords = ['TEST'];
  static logPath = process.env.LOG_PATH || '';
  static nodeDir = process.env.NODE_DIR || '';

  static getConfig() {
    return {
      webpackedFilePath: Debugger.webpackedFilePath,
      destinationPath: Debugger.destinationPath,
      keywords: Debugger.keywords,
      logPath: Debugger.logPath,
      nodeDir: Debugger.nodeDir,
    };
  }
}

module.exports = Debugger;
