const {
  filter,
} = require('.');

/**
 * Exclude link from change message
 *
 * @param {string} row
 * @returns {string}
 */
function excludeLinkFromRow(row, link) {
  return row.replace(new RegExp(`(\\(${link}\\S+\\))`), '');
}

/**
 * Add link to message
 *
 * @param {string} row
 * @param {string} link
 * @param {RegExp} taskRegex
 * @returns {string}
 */
function addLinkToRow(row, link, taskRegex) {
  const match = row.match(taskRegex);

  if (match) {
    const task = match[0];

    return `${task}(${link}${task.replace(/[[|\]]/g, '')})${row.replace(`${task}`, '')}`;
  }

  return row;
}

/**
 * Split changelog line by line
 *
 * @param {string} changelog
 * @returns {Array<string>}
 */
function splitChangelog(changelog) {
  return changelog.split('\n');
}

/**
 * Check row for header
 *
 * @param {string} row
 * @returns {boolean}
 */
function isReleaseHead(row) {
  return /^(##\s\[\d\.\d\.\d\])/.test(row);
}

/**
 * Get releases headers from changelog
 *
 * @param {Array<string>} splittedChangelog
 * @returns {Array<string>}
 */
function getChangelogReleasesHeaders(splittedChangelog) {
  return filter(splittedChangelog, isReleaseHead);
}

/**
 * Get the index of release header
 *
 * @param {Array<string>} splittedChangelog
 * @param {string} header
 */
function getReleaseHeaderIndex(splittedChangelog, header) {
  return splittedChangelog.indexOf(header);
}

/**
 * Get release from changelog
 *
 * @param {Array<string>} splittedChangelog
 * @param {number} startIndex
 * @param {number} endIndex
 * @returns {string}
 */
function getRelease(splittedChangelog, startIndex, endIndex) {
  return splittedChangelog
    .slice(startIndex, endIndex)
    .join('\n');
}

/**
 * Get releases from changelog
 *
 * @param {Array<string>} splittedChangelog
 */
function getChangelogReleases(splittedChangelog) {
  return getChangelogReleasesHeaders(splittedChangelog).reduce(
    (acc, header, index, array) => {
      const currentPoint = getReleaseHeaderIndex(splittedChangelog, header);
      const nextPoint = array[index + 1]
        ? getReleaseHeaderIndex(splittedChangelog, array[index + 1])
        : splittedChangelog.length - 1;

      return [...acc, getRelease(splittedChangelog, currentPoint, nextPoint)];
    },
    [],
  );
}

/**
 * Get changelog head
 *
 * @param {Array<string>} splittedChangelog
 * @param {number} lastReleaseHeaderIndex
 * @returns {string}
 */
function getChangelogHead(splittedChangelog, lastReleaseHeaderIndex) {
  return splittedChangelog
    .slice(0, lastReleaseHeaderIndex - 1)
    .join('\n');
}

/**
 * Inject new release to the changelog
 *
 * @param {string} prevChangelog
 * @param {string} newRelease
 * @returns {string}
 */
function injectRelease(prevChangelog, newRelease) {
  const splittedChangelog = splitChangelog(prevChangelog);
  const lastReleaseHeaderIndex = getReleaseHeaderIndex(
    splittedChangelog,
    getChangelogReleasesHeaders(splittedChangelog)[0],
  );
  const changelogHead = getChangelogHead(
    splittedChangelog,
    lastReleaseHeaderIndex,
  );
  const releases = getChangelogReleases(splittedChangelog);

  return `${changelogHead}\n\n${newRelease}\n\n${releases.join('\n')}\n`;
}

/**
 * Check row for change message
 *
 * @param {string} row
 * @param {RegExp} match
 * @returns {boolean}
 */
function isChangeMessageRow(row, match) {
  return match
    ? match.test(row)
    : null;
}

/**
 * Get message from change message row
 *
 * @param {string} row
 * @param {RegExp} messageRowPrefix
 * @returns {string|null}
 */
function getMessageFromChangeMessageRow(row, messageRowPrefix) {
  return row && messageRowPrefix
    ? row.replace(messageRowPrefix, '')
    : null;
}

/**
 * Get all change messages from changelog release
 *
 * @param {Array<string>} changelogRelease
 * @returns {Array<string>}
 */
function getChangeMessageRowsFromRelease(changelogRelease, match) {
  return changelogRelease
    ? filter(changelogRelease, (row) => isChangeMessageRow(row, match))
    : null;
}

/**
 * Get last release from changelog
 *
 * @param {Array<Array<string>>} changelogReleases
 * @returns {Array<string>}
 */
function getLastChangelogRelease(changelogReleases) {
  return changelogReleases
    ? changelogReleases[0]
    : null;
}

module.exports = {
  excludeLinkFromRow,
  addLinkToRow,
  getChangelogReleasesHeaders,
  getChangelogReleases,
  getChangelogHead,
  injectRelease,
  isChangeMessageRow,
  getMessageFromChangeMessageRow,
  getChangeMessageRowsFromRelease,
  getLastChangelogRelease,
  splitChangelog,
};
