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

const fs = require('fs');

const {
  changelogFileName,
} = require('../app/constants');

/**
 * Converting keywords to RegExp
 *
 * @param {string} keywords
 * @returns {RegExp}
 */
function convertKeywordsToRegexp(keywords) {
  return new RegExp(`(${keywords.split(', ').join('|')})`);
}

/**
 * Get the path to the working directory
 *
 * @returns {string}
 */
function currentDir() {
  return process.cwd();
}

/**
 * Read project file
 *
 * @param {string} fileName - File path
 * @returns {string}
 */
function readProjectFile(fileName) {
  return fs.readFileSync(`${currentDir()}${fileName}`, 'utf-8');
}

/**
 * Get project version
 *
 * @returns {string}
 */
function getProjectVersion() {
  return (JSON.parse(readProjectFile('/package.json'))).version;
}

/**
 * Get project changelog
 *
 * @returns {string}
 */
function getProjectChangelog() {
  return readProjectFile(`/${changelogFileName}`);
}

/**
 * Currying function
 *
 * @param {Function} fn
 * @returns {Function}
 */
function curry(fn) {
  return function curried(...args) {
    if (fn.length === args.length) {
      return fn.apply(this, args);
    }
    return function pass(...args2) {
      return curried.apply(this, args.concat(args2));
    };
  };
}

/**
 * Pipeline helper
 *
 * @param {any} val
 * @returns {any}
 */
function pipe(val) {
  return (...fns) => fns.reduce(
    (acc, fn) => {
      if (Array.isArray(fn)) {
        const [func, ...args] = fn;

        return func(acc, ...args);
      }

      return fn(acc);
    },
    val,
  );
}

/**
 * Just a map
 *
 * @param {Array<any>} array
 * @param {Function} cb
 * @returns {Array<any>}
 */
function map(array, cb) {
  return array.map(cb);
}

module.exports = {
  convertKeywordsToRegexp,
  currentDir,
  readProjectFile,
  getProjectVersion,
  getProjectChangelog,
  pipe,
  curry,
  map,
};
