const fs = require('fs');

const rawConfig = fs.readFileSync(__dirname + '/../config.json');
const config = JSON.parse(rawConfig);

module.exports = {
  commitPrefix: new RegExp(config.commitPrefix),
  taskPrefix: new RegExp(config.taskPrefixRegex),
  withoutTaskPrefix: new RegExp(config.withoutTaskPrefix),
  fixTaskKeywords: new RegExp(config.fixTaskKeyword),
  changeTaskKeywords: new RegExp(config.changeTaskKeyword),
  featureTaskKeywords: new RegExp(config.featureTaskKeyword),
}