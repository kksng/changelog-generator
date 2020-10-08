const cli = require('commander');

const {
  getCommits,
} = require('./api');
const {
  getCommitsBetweenHashes,
  filterCommitsByMatch,
} = require('../lib/git');
const {
  generateTemplate,
  saveTemplate,
} = require('../lib/template');
const {
  logError,
  logSuccess,
  logWarning,
} = require('../lib/log');

const {
  commitPrefix,
  taskPrefix,
  fixTaskKeywords,
  changeTaskKeywords,
  featureTaskKeywords,
} = require('./constants');

cli
  .version('0.0.2')
  .description('Changelog generator.');

cli
  .command('gen <repo_path>')
  .option('-fc --from-commit <hash>', 'Get commits from hash')
  .option('-tc --to-commit <hash>', 'Get commits to hash')
  .option('-rd --release-date <date>', 'Release date. Example: 21-12-2012')
  .option('-rv --release-version <version>', 'Release version. Example: 1.0.0')
  .description('Generate changelog')
  .action(async (path, cmd) => {
    if (cmd.toCommit && !cmd.fromCommit) {
      logError('missing argument --from-commit');
      return;
    }
    if (!cmd.releaseDate) {
      logError('missing argument --release-date');
      return;
    }
    if (!cmd.releaseVersion) {
      logError('missing argument --release-version');
      return;
    }
    const commits = await getCommits(path, commitPrefix);

    if (cmd.fromCommit) {
      const selectionCommits = getCommitsBetweenHashes(commits, cmd.fromCommit, cmd.toCommit);

      if (!selectionCommits.length) {
        logWarning('Commits not found');
        return;
      }
      const filteredTaskCommits = filterCommitsByMatch(selectionCommits, taskPrefix);
      const fixedCommits = filterCommitsByMatch(filteredTaskCommits, fixTaskKeywords);
      const changedCommits = filterCommitsByMatch(filteredTaskCommits, changeTaskKeywords);
      const addedCommits = filterCommitsByMatch(filteredTaskCommits, featureTaskKeywords);

      const template = generateTemplate({
        releaseVersion: cmd.releaseVersion,
        releaseDate: cmd.releaseDate,
        addedCommits,
        fixedCommits,
        changedCommits,
      });

      saveTemplate(template);
      logSuccess('Complete!');
    }
  });

cli.parse(process.argv);
