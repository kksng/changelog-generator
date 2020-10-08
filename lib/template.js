const fs = require('fs');

const {
  getCommitMessage,
} = require('./git');
const {
  defautTemplateFileName,
} = require('../app/constants');

/**
 * Create change row
 *
 * @param {Commit} commit
 * @returns {string}
 */
function changeRow(commit) {
  return `- ${getCommitMessage(commit)}`;
}

/**
 * Create changes list
 *
 * @param {Array<Commit>} commits
 * @returns {string}
 */
function mapChangeRows(commits) {
  return commits.map(changeRow).join('\n');
}

/**
 * Generate changelog by template
 *
 * @param {string} releaseVersion
 * @param {string} releaseDate
 * @param {Array<Commit>} addedCommits
 * @param {Array<Commit>} fixedCommits
 * @param {Array<Commit>} changedCommits
 * @returns {string}
 */
function generateTemplate(
  releaseVersion,
  releaseDate,
  addedCommits,
  fixedCommits,
  changedCommits,
) {
  return `
## [${releaseVersion}] - ${releaseDate}

### Added
${mapChangeRows(addedCommits)}

### Fixed
${mapChangeRows(fixedCommits)}

### Changed
${mapChangeRows(changedCommits)}`;
}

/**
 * Save template to file
 *
 * @param {string} template
 * @param {string} fileName
 * @returns {void}
 */
function saveTemplate(template, fileName = defautTemplateFileName) {
  fs.writeFileSync(`${__dirname}/../${fileName}`, template);
}

module.exports = {
  generateTemplate,
  saveTemplate,
};
