const {
  addLinkToRow,
  excludeLinkFromRow,
} = require('../parser');

const taskPrefix = /(\[TASK-\d+\])/;
const link = 'https://jira.esphere.ru/browse/';
const message = '[TASK-1876](https://jira.esphere.ru/browse/TASK-1876): Исправлена валидация поля email при восстановлении пароля';
const messageWithoutLink = '[TASK-1876]: Исправлена валидация поля email при восстановлении пароля';
const messageNoTask = '[NO-TASK]: Исправлена валидация поля email при восстановлении пароля';

describe('lib/parser: excludeLinkFromRow', () => {
  test('Should replace link from change message', () => {
    const replacedMessage = excludeLinkFromRow(message, link);

    expect(replacedMessage).toEqual('[TASK-1876]: Исправлена валидация поля email при восстановлении пароля');
  });
});

describe('lib/parser: addLinkToRow', () => {
  test('Should return message with link', () => {
    const messageWithLink = addLinkToRow(messageWithoutLink, link, taskPrefix);

    expect(messageWithLink).toEqual('[TASK-1876](https://jira.esphere.ru/browse/TASK-1876): Исправлена валидация поля email при восстановлении пароля');
  });

  test('Should return source message', () => {
    const sourceMessage = addLinkToRow(messageNoTask, link, taskPrefix);

    expect(sourceMessage).toEqual(messageNoTask);
  });
});
