const fs = require('fs');

const rawConfig = fs.readFileSync(`${__dirname}/../config.json`);
const config = JSON.parse(rawConfig);

module.exports = {
  /**
   * @type {RegExp} - Regexp with prefixes of required commits.
   */
  commitPrefix: new RegExp(config.commitPrefix),
  /**
   * @type {RegExp} - Regexp with a prefix of task tag. Example: [AAAA-1000]
   */
  taskPrefix: new RegExp(config.taskPrefixRegex),
  /**
   * @type {RegExp} - Regexp with prefix of no-task tag. Example: [NO-TASK]
   */
  withoutTaskPrefix: new RegExp(config.withoutTaskPrefix),
  /**
   * @type {RegExp} - Keyword regex for bugfix commits.
   */
  fixTaskKeywords: new RegExp(config.fixTaskKeyword),
  /**
   * @type {RegExp} - Keyword regex for changes commits.
   */
  changeTaskKeywords: new RegExp(config.changeTaskKeyword),
  /**
   * @type {RegExp} - Keyword regex for features commits.
   */
  featureTaskKeywords: new RegExp(config.featureTaskKeyword),
  /**
   * @type {string} - Default value for the file name of the generated template.
   */
  defautTemplateFileName: config.defautTemplateFileName,
  /**
   * @type {string} - Changelog template.
   */
  changelogTemplate: fs.readFileSync(`${__dirname}/../changelog-template`, 'utf8'),
  /**
   * @type {string} - The prefix before the commit row in the template
   */
  templateRowPrefix: config.templateRowPrefix,
};
