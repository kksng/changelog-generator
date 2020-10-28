const {
  convertKeywordsToRegexp,
} = require('..');

describe('lib/common: preparingRegExpKeywords', () => {
  test('Should return correct string', () => {
    const preparedKeywords = convertKeywordsToRegexp('Исправлен, Поправлен');

    expect(preparedKeywords).toEqual(/(Исправлен|Поправлен)/);
  });
});
