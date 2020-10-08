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
          const fixCommits = filterCommitsByMatch(filteredTaskCommits, fixTaskKeywords);
          const changeCommits = filterCommitsByMatch(filteredTaskCommits, changeTaskKeywords);
          const featureCommits = filterCommitsByMatch(filteredTaskCommits, featureTaskKeywords);

          const template = generateTemplate(
            cmd.releaseVersion,
            cmd.releaseDate,
            featureCommits,
            fixCommits,
            changeCommits);

          saveTemplate(template);
          logSuccess('Complete!');
        }
      });

cli.parse(process.argv)
