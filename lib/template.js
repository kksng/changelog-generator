const fs = require('fs');

const {
  currentDir,
  pipe,
  map,
} = require('.');
const {
  changelogFileName,
  changelogTemplate,
  templateRowPrefix,
} = require('../app/constants');

function createReleaseDate() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();

  return `${year}-${month}-${date}`;
}

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
 * @param {string} message
 * @returns {string}
 */
function changeRow(message) {
  return `${templateRowPrefix}${message}`;
}

/**
 * Create changes list
 * @private
 *
 * @param {Array<string>} messages
 * @returns {string}
 */
function mapChangeRows(messages) {
  const createChangeRow = (message) => pipe(message)(
    changeRow,
  );

  return map(messages, createChangeRow).join('\n');
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
function saveTemplate(template, fileName = changelogFileName) {
  fs.writeFileSync(`${currentDir()}/${fileName}`, template);
}

module.exports = {
  generateTemplate,
  saveTemplate,
  createReleaseDate,
};
