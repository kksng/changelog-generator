const fs = require('fs');
const cli = require('commander');
const inquirer = require('inquirer');
const { version } = require('../package.json');

const {
  getCommits,
  gitCheckout,
  gitPull,
} = require('./api');
const {
  currentDir,
  convertKeywordsToRegexp,
  getProjectVersion,
  getProjectChangelog,
  pipe,
  curry,
} = require('../lib');
const {
  getCommitsBetweenHashes,
  filterCommitsByMatch,
  excludeCommitsByMatch,
  getCommitsByMessages,
  sortCommitsByDate,
  getCommitHash,
  getNextCommit,
} = require('../lib/git');
const {
  generateTemplate,
  saveTemplate,
  createReleaseDate,
} = require('../lib/template');
const {
  logError,
  logSuccess,
  logWarning,
} = require('../lib/log');
const {
  injectRelease,
  splitChangelog,
  getChangelogReleases,
  getLastChangelogRelease,
  getChangeMessageRowsFromRelease,
  getMessageFromChangeMessageRow,
} = require('../lib/parser');

const {
  commitPrefix,
  taskPrefix,
  escapeTasksPrefix,
  fixTaskKeywords,
  changeTaskKeywords,
  addedTaskKeywords,
  changelogBranch,
  templateRowPrefix,
} = require('./constants');

const initQuestions = [
  {
    type: 'input', name: 'changelogBranch', message: 'Choose the branch where from generate a changelog', default: 'master',
  },
  {
    type: 'input', name: 'changelogFileName', message: 'What\'s your changelog file name', default: 'CHANGELOG.md',
  },
  {
    type: 'input', name: 'templateRowPrefix', message: 'Enter template row prefix', default: '- ',
  },
  {
    type: 'input', name: 'commitPrefix', message: 'Enter your commits prefix (RegExp)', default: '^(\\[TASK\\-\\d+\\]|\\[NO-TASK\\])',
  },
  {
    type: 'input', name: 'taskPrefix', message: 'Enter your task commits prefix', default: '^(\\[TASK\\-\\d+\\])',
  },
  {
    type: 'input', name: 'withoutTaskPrefix', message: 'Enter your without task commits prefix', default: '^(\\[NO-TASK\\])',
  },
  {
    type: 'input', name: 'escapeTaskPrefix', message: 'Enter regex for commits to be skipped', default: null,
  },
  {
    type: 'input', name: 'fixTaskKeyword', message: 'Enter fix task keywords', default: 'Исправлен, Поправлен',
  },
  {
    type: 'input', name: 'changeTaskKeyword', message: 'Enter change task keywords', default: 'Обновлен, Заменен, Рефакторинг, Выполнен',
  },
  {
    type: 'input', name: 'addedTaskKeyword', message: 'Enter added task keywords', default: 'Добавлен, Реализован',
  },
];

cli
  .version(version)
  .description('Changelog generator.');

cli
  .command('init')
  .description('Init config')
  .alias('i')
  .action(async () => {
    inquirer
      .prompt(initQuestions)
      .then((answers) => {
        fs.writeFileSync(`${currentDir()}/cg.config.json`, JSON.stringify(answers, null, 2));
      });
  });

cli
  .command('gen')
  .description('Generate changelog')
  .alias('g')
  .option('-fc --from-commit <hash>', 'Get commits from hash')
  .option('-tc --to-commit <hash>', 'Get commits to hash')
  .option('-rd --release-date <date>', 'Release date. Example: 21-12-2012')
  .option('-rv --release-version <version>', 'Release version. Example: 1.0.0')
  .action(async (cmd) => {
    try {
      if (cmd.fromCommit && cmd.toCommit) {
        throw new Error('missing argument --to-commit');
      }

      const path = currentDir();
      const projectChangelog = getProjectChangelog();
      const projectVersion = cmd.releaseVersion || getProjectVersion();
      const releaseDate = cmd.releaseDate || createReleaseDate();

      await gitCheckout(path, changelogBranch);
      logSuccess(`✓ Checkout to ${changelogBranch}`);

      await gitPull(path);
      logSuccess('✓ Pull changes');

      const commits = await getCommits(path, commitPrefix);
      logSuccess('✓ Gotten commits');

      if (cmd.fromCommit) {
        const filteredTaskCommits = pipe(commits)(
          [getCommitsBetweenHashes, cmd.fromCommit, cmd.toCommit],
          [filterCommitsByMatch, taskPrefix],
          [excludeCommitsByMatch, escapeTasksPrefix],
        );

        if (!filteredTaskCommits.length) {
          logWarning('Commits not found');
          return;
        }
        const filterCommitsFromFilteredTasks = curry(filterCommitsByMatch)(filteredTaskCommits);
        const fixedCommits = filterCommitsFromFilteredTasks(
          convertKeywordsToRegexp(fixTaskKeywords),
        );
        const changedCommits = filterCommitsFromFilteredTasks(
          convertKeywordsToRegexp(changeTaskKeywords),
        );
        const addedCommits = filterCommitsFromFilteredTasks(
          convertKeywordsToRegexp(addedTaskKeywords),
        );

        const template = generateTemplate({
          releaseVersion: projectVersion,
          releaseDate,
          addedCommits,
          fixedCommits,
          changedCommits,
        });

        saveTemplate(injectRelease(projectChangelog, template));
        logSuccess('Complete!');
      } else {
        const releaseMessages = pipe(projectChangelog)(
          splitChangelog,
          getChangelogReleases,
          getLastChangelogRelease,
          splitChangelog,
          [
            getChangeMessageRowsFromRelease,
            new RegExp(
              `${commitPrefix}`
                .replace('^', '')
                .replace(/\//g, ''),
            ),
          ],
        ).map((row) => getMessageFromChangeMessageRow(row, templateRowPrefix));

        const lastReleaseCommitHash = getCommitHash(
          sortCommitsByDate(
            getCommitsByMessages(commits, releaseMessages),
          )[0],
        );
        const toCommit = getNextCommit(commits, lastReleaseCommitHash);
        const fromCommit = commits[0];

        const filteredTaskCommits = pipe(commits)(
          [getCommitsBetweenHashes, getCommitHash(fromCommit), getCommitHash(toCommit)],
          [filterCommitsByMatch, taskPrefix],
          [excludeCommitsByMatch, escapeTasksPrefix],
        );
        const filterCommitsFromFilteredTasks = curry(filterCommitsByMatch)(filteredTaskCommits);
        const fixedCommits = filterCommitsFromFilteredTasks(
          convertKeywordsToRegexp(fixTaskKeywords),
        );
        const changedCommits = filterCommitsFromFilteredTasks(
          convertKeywordsToRegexp(changeTaskKeywords),
        );
        const addedCommits = filterCommitsFromFilteredTasks(
          convertKeywordsToRegexp(addedTaskKeywords),
        );
        const template = generateTemplate({
          releaseVersion: projectVersion,
          releaseDate,
          addedCommits,
          fixedCommits,
          changedCommits,
        });

        saveTemplate(injectRelease(projectChangelog, template));
        logSuccess('Complete!');
      }
    } catch (error) {
      logError(error.message);
    }
  });

cli.parse(process.argv);
