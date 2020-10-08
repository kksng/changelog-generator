const fs = require('fs');

const {
  getCommitMessage,
} = require('./git');
const {
  defautTemplateFileName,
  changelogTemplate,
  templateRowPrefix,
} = require('../app/constants');

/**
 * Adds "this." to the template before the variable
 * @private
 *
 * @param {string} template
 * @returns {string}
 */
function addThisToVariables(template) {
  return template.replace(/\$\{/g, '${this.');
}

/**
 * Create change row
 * @private
 *
 * @param {Commit} commit
 * @returns {string}
 */
function changeRow(commit) {
  return `${templateRowPrefix}${getCommitMessage(commit)}`;
}

/**
 * Create changes list
 * @private
 *
 * @param {Array<Commit>} commits
 * @returns {string}
 */
function mapChangeRows(commits) {
  return commits.map(changeRow).join('\n');
}

/**
 * Fill template from a template file
 * @private
 *
 * @param {string} template
 * @param {TemplateVariables} values
 * @returns {string}
 */
function fillTemplate(template, values) {
  const addedCommits = mapChangeRows(values.addedCommits);
  const fixedCommits = mapChangeRows(values.fixedCommits);
  const changedCommits = mapChangeRows(values.changedCommits);

  // eslint-disable-next-line no-new-func
  return new Function(`return \`${addThisToVariables(template)}\`;`)
    .call({
      ...values,
      addedCommits,
      fixedCommits,
      changedCommits,
    });
}

/**
 * Generate changelog by template
 *
 * @param {TemplateVariables} values
 * @returns {string}
 */
function generateTemplate(values) {
  return fillTemplate(changelogTemplate, values);
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
