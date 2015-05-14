var api = require('jspm/api');
var fs = require('fs');
var logger  = require('../lib/logger');
var installer = require('../lib/installer');

function update(options) {
  logger.log(options);
  if (options.nuclear){
    logger.log('Going NUCLEAR!')
    logger.log('Clearing jspm packages...')
    moveJSPMPackages(function(){
      logger.log('Clearing npm packages...')
      moveNPMPackages(function(){
        installer.runNPMInstall(function(){
          logger.log('Successfully npm installed');
          logger.log('Running jspm install');
          installer.runJSPMInstall(function() {
            logger.log('Successfully jspm installed');
          });
        });
      });
    });
  } else {
    logger.log('not going nuclear')
  }
}

function moveJSPMPackages(done){
  fs.rename('./jspm_packages', './jspm_packages_backup', done);
}

function moveNPMPackages(done){
  fs.rename('node_modules', 'node_modules_backup', done);
}

module.exports = {
  update: update
}
