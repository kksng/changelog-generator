const fs = require('fs');

const configFileName = 'cg.config.json';
const rawConfig = (() => {
  try {
    return fs.readFileSync(`${process.cwd()}/${configFileName}`);
  } catch (_) {
    return fs.readFileSync(`${__dirname}/../${configFileName}`);
  }
})();
const config = JSON.parse(rawConfig);

module.exports = {
  /**
   * @type {string} - The branch from which the changelog is generated
   */
  changelogBranch: config.changelogBranch,
  /**
   * @type {string} - Changelog file name
   */
  changelogFileName: config.changelogFileName,
  /**
   * @type {string} - Link to jira
   */
  jiraLink: config.jiraLink,
  /**
   * @type {RegExp} - Regexp with prefixes of required commits.
   */
  commitPrefix: new RegExp(config.commitPrefix),
  /**
   * @type {RegExp} - Regexp with a prefix of task tag. Example: [AAAA-1000]
   */
  taskPrefix: new RegExp(config.taskPrefix),
  /**
   * @type {RegExp} - Regexp with prefix of no-task tag. Example: [NO-TASK]
   */
  withoutTaskPrefix: new RegExp(config.withoutTaskPrefix),
  /**
   * @type {RegExp} - Regexp with prefix for escape tasks.
   */
  escapeTasksPrefix: config.escapeTasksPrefix.length ? new RegExp(config.escapeTasksPrefix) : null,
  /**
   * @type {string} - Keyword regex for bugfix commits.
   */
  fixTaskKeywords: config.fixTaskKeyword,
  /**
   * @type {string} - Keyword regex for changes commits.
   */
  changeTaskKeywords: config.changeTaskKeyword,
  /**
   * @type {string} - Keyword regex for added commits.
   */
  addedTaskKeywords: config.addedTaskKeyword,
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
