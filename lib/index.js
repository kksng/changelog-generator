/**
 * @typedef Commit
 * @type {object}
 * @property {string} hash
 * @property {string} authorName
 * @property {string} authorEmail
 * @property {Date} date
 * @property {string} message
 */

/**
 * @typedef TemplateVariables
 * @type {object}
 * @property {string} releaseVersion
 * @property {string} releaseDate
 * @property {Array<Commit>} addedCommits
 * @property {Array<Commit>} fixedCommits
 * @property {Array<Commit>} changedCommits
 */
