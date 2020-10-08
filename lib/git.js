/**
 * Check message for consistency
 *
 * @param {String} message
 * @param {RegExp} match
 * @returns {Boolean}
 */
function isMessageMatch(message, match) {
  return match.test(message)
}

/**
 * Get message from commit
 *
 * @param {Commit} commit
 * @returns {string}
 */
function getCommitMessage(commit) {
  return commit
    ? commit.message
    : ''
}

/**
 * Get date from commit
 *
 * @param {Commit} commit
 * @returns {Date | null}
 */
function getCommitDate(commit) {
  return commit
    ? new Date(commit.date)
    : null
}

/**
 * Get hash from commit
 *
 * @param {Commit} commit
 * @returns {string | null}
 */
function getCommitHash(commit) {
  return commit
    ? commit.hash
    : null
}

/**
 * Get an index of the commit from the commits list
 *
 * @param {Array<Commit>} commits
 * @param {string} hash
 * @returns {string | null}
 */
function getCommitIndexByHash(commits, hash) {
  return hash
    ? commits
      .map(getCommitHash)
      .indexOf(hash)
    : null
}

/**
 * Exclude commits list by RegExp
 *
 * @param {Array<Commit>} commits
 * @param {RegExp} match
 * @returns {Array<Commit>}
 */
function excludeCommits(commits, match) {
  return commits
    .filter(commit => !match.test(commit))
}

/**
 * Filter commits by RegExp
 *
 * @param {Array<Commit>} commits
 * @param {RegExp} match
 * @returns {Array<Commit>}
 */
function filterCommitsByMatch(commits, match) {
  return commits
    .filter(
      commit =>
        isMessageMatch(
          getCommitMessage(commit),
          match
        )
    )
}

/**
 * Get commits between hashes
 *
 * @param {Array<Commit>} commits
 * @param {string} hashFrom
 * @param {string} hashTo
 * @returns {Array<Commit>}
 */
function getCommitsBetweenHashes(commits, hashFrom, hashTo) {
  return commits
    .slice(
      getCommitIndexByHash(commits, hashFrom),
      hashTo
        ? getCommitIndexByHash(commits,hashTo) + 1
        : undefined)
}

module.exports = {
  isMessageMatch,
  getCommitMessage,
  getCommitDate,
  getCommitHash,
  getCommitIndexByHash,
  excludeCommits,
  filterCommitsByMatch,
  getCommitsBetweenHashes,
}
