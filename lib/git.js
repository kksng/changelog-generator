/**
 * Check message for consistency
 *
 * @param {String} message
 * @param {RegExp} match
 * @returns {Boolean}
 */
function isMessageMatch(message, match) {
  return message && match
    ? match.test(message)
    : null;
}

/**
 * Get message from commit
 *
 * @param {Commit} commit
 * @returns {string}
 */
function getCommitMessage(commit) {
  return commit && commit.message
    ? commit.message
    : '';
}

/**
 * Get date from commit
 *
 * @param {Commit} commit
 * @returns {Date | null}
 */
function getCommitDate(commit) {
  return commit && commit.date
    ? new Date(commit.date)
    : null;
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
    : null;
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
    : null;
}

/**
 * Exclude commits list by RegExp
 *
 * @param {Array<Commit>} commits
 * @param {RegExp} match
 * @returns {Array<Commit>}
 */
function excludeCommitsByMatch(commits, match) {
  return commits && match
    ? commits
      .filter(
        (commit) => !isMessageMatch(getCommitMessage(commit), match),
      )
    : commits;
}

/**
 * Filter commits by RegExp
 *
 * @param {Array<Commit>} commits
 * @param {RegExp} match
 * @returns {Array<Commit>}
 */
function filterCommitsByMatch(commits, match) {
  return commits && match
    ? commits
      .filter(
        (commit) => isMessageMatch(
          getCommitMessage(commit),
          match,
        ),
      )
    : null;
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
  return commits && hashFrom
    ? commits
      .slice(
        getCommitIndexByHash(commits, hashFrom),
        hashTo
          ? getCommitIndexByHash(commits, hashTo) + 1
          : undefined,
      )
    : null;
}

/**
 * Get a commit objects by specified commit-messages
 *
 * @param {Array<Commit>} commits
 * @param {string[]} commitMessages
 * @returns {Array<Commit>}
 */
function getCommitsByMessages(commits, commitMessages) {
  return commits && commitMessages
    ? commits.filter((commit) => commitMessages.includes(getCommitMessage(commit)))
    : null;
}

/**
 * Sort commits list by date
 *
 * @param {Array<Commit>} commits
 * @returns {Array<Commit>}
 */
function sortCommitsByDate(commits) {
  return commits
    .sort((commitA, commitB) => getCommitDate(commitB) - getCommitDate(commitA));
}

/**
 * Get next commit from commits list
 *
 * @param {Array<Commit>} commits
 * @param {string} hash
 * @returns {Commit}
 */
function getNextCommit(commits, hash) {
  return commits.find((commit) => getCommitHash(commit) === hash);
}

module.exports = {
  isMessageMatch,
  getCommitMessage,
  getCommitDate,
  getCommitHash,
  getCommitIndexByHash,
  excludeCommitsByMatch,
  filterCommitsByMatch,
  getCommitsBetweenHashes,
  getCommitsByMessages,
  sortCommitsByDate,
  getNextCommit,
};
