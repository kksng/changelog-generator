const fs = require('fs');

const rawConfig = fs.readFileSync(__dirname + '/../config.json');
const config = JSON.parse(rawConfig);

/**
 * @typedef Constants
 * @type {object}
 * @property {RegExp} commitPrefix - Regexp with prefixes of required commits.
 * @property {RegExp} taskPrefix - Regexp with a prefix of task tag. Example: [AAAA-1000]
 * @property {RegExp} withoutTaskPrefix - Regexp with prefix of no-task tag. Example: [NO-TASK]
 * @property {RegExp} fixTaskKeywords - Keyword regex for bugfix commits.
 * @property {RegExp} changeTaskKeywords - Keyword regex for changes commits.
 * @property {RegExp} featureTaskKeywords - Keyword regex for features commits.
 * @property {RegExp} defautTemplateFileName - Default value for the file name of the generated template.
 */
module.exports = {
  commitPrefix: new RegExp(config.commitPrefix),
  taskPrefix: new RegExp(config.taskPrefixRegex),
  withoutTaskPrefix: new RegExp(config.withoutTaskPrefix),
  fixTaskKeywords: new RegExp(config.fixTaskKeyword),
  changeTaskKeywords: new RegExp(config.changeTaskKeyword),
  featureTaskKeywords: new RegExp(config.featureTaskKeyword),
  defautTemplateFileName: config.defautTemplateFileName,
}