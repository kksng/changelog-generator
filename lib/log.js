const chalk = require('chalk');

/**
 * Console.log alias
 */
const { log } = console;

/**
 * Create a error message
 *
 * @param {string} message
 * @returns {string}
 */
function logError(message) {
  return log(`${chalk.red('ERROR:')} ${message}`);
}

/**
 * Create a success message
 *
 * @param {string} message
 * @returns {string}
 */
function logSuccess(message) {
  return log(chalk.green(message));
}

/**
 * Create a warning message
 *
 * @param {string} message
 * @returns {string}
 */
function logWarning(message) {
  return log(chalk.yellow(message));
}

module.exports = {
  log,
  logError,
  logSuccess,
  logWarning,
};
