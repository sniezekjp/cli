var fs = require('fs')
  , logger  = require('../lib/logger')
  , installer = require('../lib/installer')
  , spawnPromise = require('../lib/spawn-promise')

var repoList = [
  'aurelia-binding',
  'aurelia-bootstrapper',
  'aurelia-dependency-injection',
  'aurelia-framework',
  'aurelia-history-browser',
  'aurelia-http-client',
  'aurelia-loader-default',
  'aurelia-loader',
  'aurelia-route-recognizer',
  'aurelia-router',
  'aurelia-templating-binding',
  'aurelia-templating-resources',
  'aurelia-templating-router',
  'aurelia-templating'
];

function update(options) {
  if (options.nuclear){
    logger.log('Going NUCLEAR!')
    logger.log('Clearing jspm packages...');
    moveJSPMPackages(function(){
      logger.log('Clearing npm packages...');
      moveNPMPackages(function(){
        normalUpdate();
      });
    });
  } else {
    logger.log('Updating normally...');
    normalUpdate();
  }
}

function unbundle(){
  logger.log('Running jspm unbundle');
  var options = {
    command: 'jspm',
    args: ['unbundle']
  };
  return spawnPromise(options)
}

function updateAllRepos(){
  promiseArray = [];
  repoList.forEach(function(repoName){
    promiseArray.push(spawnPromise(options));
  });
  return Promise.all(promiseArray);
}

function normalUpdate(){
  unbundle.then(function(){
    installer.runNPMInstall(function(){
      logger.log('Successfully npm installed');
      logger.log('Running jspm unbundle');
      var options = {
        command: 'jspm',
        args: ['update']
      };
      spawnPromise(options)
      .then(function(){
        spawnPromise({
          command: 'jspm',
          args: ['clean']
        })
      });
    });
  });
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
