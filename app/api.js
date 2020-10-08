const { gitToJs } = require('git-parse')

/**
 * Get commits list from repository
 * 
 * @param {string} pathToRepository - Path to your repository folder
 * @returns {Promise<Array<Commit>>}
 */
async function getCommits(pathToRepository) {
  try {
    return await gitToJs(pathToRepository);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getCommits,
}
