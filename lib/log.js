const chalk = require('chalk');

const log = console.log;

/**
 *
 * @param {string} message
 * @returns {string}
 */
function logError(message) {
  return log(`${chalk.red('ERROR:')} ${message}`);
}

/**
 *
 * @param {string} message
 * @returns {string}
 */
function logSuccess(message) {
  return log(chalk.green(message));
}

/**
 *
 * @param {string} message
 * @returns {string}
 */
function logWarning(message) {
  return log(chalk.yellow(message));
}

module.exports = {
  logError,
  logSuccess,
  logWarning,
}