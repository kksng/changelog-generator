const {
  getCommitMessage,
  getCommitDate,
  getCommitHash,
  isMessageMatch,
  getCommitIndexByHash,
  excludeCommits,
  filterCommitsByMatch,
  getCommitsBetweenHashes,
} = require('../git');

const commit = {
  hash: 'c23cb42f326fd5a137935ca143f2b5ec6d71b3d0',
  authorName: 'Author Name',
  authorEmail: 'example@mail.com',
  date: 'Thu, 8 Oct 2020 11:09:13 +0200',
  message: '[TASK-1234]: Fix something',
};
const commit2 = {
  hash: 'c23cb42f326fd5a137935ca143f2b5ec6d71b3d1',
  authorName: 'Author Name',
  authorEmail: 'example@mail.com',
  date: 'Thu, 8 Oct 2020 11:09:13 +0200',
  message: '[NO-TASK]: Fix something',
};
const commit3 = {
  hash: 'c23cb42f326fd5a137935ca143f2b5ec6d71b3d2',
  authorName: 'Author Name',
  authorEmail: 'example@mail.com',
  date: 'Thu, 8 Oct 2020 11:09:13 +0200',
  message: '[TASK-4321]: Fix something',
};

const commit4 = {
  hash: 'c23cb42f326fd5a137935ca143f2b5ec6d71b3d3',
  authorName: 'Author Name',
  authorEmail: 'example@mail.com',
  date: 'Thu, 8 Oct 2020 11:09:13 +0200',
  message: '[TASK-2345]: Fix something',
};

const commits = [
  commit,
  commit2,
  commit3,
  commit4,
];

describe('lib/git: getCommitMessage', () => {
  test('Should return commit message', () => {
    const message = getCommitMessage(commit);

    expect(message).toEqual('[TASK-1234]: Fix something');
  });

  test('Should return an empty string if the commit message is empty or undefined', () => {
    const message = getCommitMessage({});

    expect(message).toEqual('');
  });

  test('Should return an empty string if the commit is undefined', () => {
    const message = getCommitMessage();

    expect(message).toEqual('');
  });
});

describe('lib/git: getCommitDate', () => {
  test('Should return commit date', () => {
    const date = getCommitDate(commit);

    expect(date).toEqual(new Date(commit.date));
  });

  test('Should return null if the commit date is empty or undefined', () => {
    const date = getCommitDate({});

    expect(date).toBeNull();
  });

  test('Should return null if the commit is undefined', () => {
    const date = getCommitDate();

    expect(date).toBeNull();
  });
});

describe('lib/git: getCommitHash', () => {
  test('Should return commit hash', () => {
    const hash = getCommitHash(commit);

    expect(hash).toEqual(commit.hash);
  });
});

describe('lib/git: isMessageMatch', () => {
  test('The commit message must match the Regexp', () => {
    const match = isMessageMatch(commit.message, /^(\[TASK-\d+\])/);

    expect(match).toBeTruthy();
  });

  test('The commit message doesn\'t have to match the Regexp', () => {
    const match = isMessageMatch(commit.message, /^(some-regular)/);

    expect(match).toBeFalsy();
  });

  test('Should return null if the regex is undefined', () => {
    const match = isMessageMatch(commit.message, undefined);

    expect(match).toBeNull();
  });
  test('Should return null if the commit message is undefined', () => {
    const match = isMessageMatch(undefined, /^(\[TASK-\d+\])/);

    expect(match).toBeNull();
  });
});

describe('lib/git: getCommitIndexByHash', () => {
  test('Should return commit index', () => {
    const index = getCommitIndexByHash(commits, commit.hash);

    expect(index).toBe(0);
  });

  test('Should return null if the commit not found', () => {
    const index = getCommitIndexByHash(commits, '');

    expect(index).toBeNull();
  });

  test('Should return null if the hash if undefined', () => {
    const index = getCommitIndexByHash(commits, undefined);

    expect(index).toBeNull();
  });

  test('Should return null if the commits list is undefined', () => {
    const index = getCommitIndexByHash(undefined, '');

    expect(index).toBeNull();
  });
});

describe('lib/git: excludeCommits', () => {
  test('Should return commits list without excluded commits', () => {
    const commitsList = excludeCommits(commits, /^(\[NO-TASK\])/);

    expect(commitsList.length).toBe(3);
  });

  test('SHould return original commits list', () => {
    const commitsList = excludeCommits(commits, /^(\[TASK-0000\])/);

    expect(commitsList.length).toBe(4);
  });

  test('Should return null if commits list is undefined', () => {
    const commitsList = excludeCommits(undefined, /^(\[NO-TASK\])/);

    expect(commitsList).toBeNull();
  });

  test('Should return null if regex is undefined', () => {
    const commitsList = excludeCommits(commits, undefined);

    expect(commitsList).toBeNull();
  });
});

describe('lib/git: filterCommitsByMatch', () => {
  test('Should return filtered commits list', () => {
    const filteredCommitsList = filterCommitsByMatch(commits, /^(\[NO-TASK\])/);

    expect(filteredCommitsList.length).toBe(1);
  });

  test('Should return null if commits list is undefined', () => {
    const filteredCommitsList = filterCommitsByMatch(undefined, /^(\[NO-TASK\])/);

    expect(filteredCommitsList).toBeNull();
  });

  test('Should return null if the regex is undefined', () => {
    const filteredCommitsList = filterCommitsByMatch(commits, undefined);

    expect(filteredCommitsList).toBeNull();
  });
});

describe('lib/git: getCommitsBetweenHashes', () => {
  test('Should return selected commits', () => {
    const selectedCommits = getCommitsBetweenHashes(commits, commit2.hash, commit4.hash);

    expect(selectedCommits[0].hash).toEqual(commit2.hash);
    expect(selectedCommits[2].hash).toEqual(commit4.hash);
  });

  test('Should return null if commits list is undefiled', () => {
    const selectedCommits = getCommitsBetweenHashes(undefined, commit2.hash, commit4.hash);

    expect(selectedCommits).toBeNull();
  });

  test('Should return null if the hashFrom is undefiled', () => {
    const selectedCommits = getCommitsBetweenHashes(commits, undefined, commit4.hash);

    expect(selectedCommits).toBeNull();
  });
  test('Should return the selected commits list from hashFrom to the last commit', () => {
    const selectedCommits = getCommitsBetweenHashes(commits, commit2.hash, undefined);

    expect(selectedCommits[0].hash).toEqual(commit2.hash);
    expect(selectedCommits[2].hash).toEqual(commit4.hash);
  });
});
