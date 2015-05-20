var cli = process.AURELIA;
var logger  = cli.import('lib/logger');
var updater = cli.import('lib/update');

// Updater
//
// Executable Command for updating Aurelia
function Update(options) {
  logger.log(options)
  logger.log('Updating Aurelia...');
  logger.log('-----------------------------------');
  updater.update(options);
}

module.exports = Update;
