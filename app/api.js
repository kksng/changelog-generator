const util = require('util');
const { gitToJs, gitPull: gp } = require('git-parse');
const exec = util.promisify(require('child_process').exec);

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

async function gitCheckout(pathToRepository, branch) {
  try {
    await exec(`cd ${pathToRepository} && git checkout ${branch}`);
  } catch (error) {
    throw new Error(error);
  }
}

async function gitPull(pathToRepository) {
  try {
    await gp(pathToRepository);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getCommits,
  gitCheckout,
  gitPull,
};
