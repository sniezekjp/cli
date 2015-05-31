import rename from 'gulp-rename';
import path from 'path';
import vynl from 'vinyl-fs';
import Promise from 'bluebird';
import store from '../config';
export default class Generator{

  constructor() {
    let templateDir = path.join.bind(path, __dirname, 'templates');
    let sourceDir   = path.join.bind(path, process.cwd());
    this.pkg = store.load('package.json');

    this.templates = {
        task   : templateDir.bind(templateDir, 'tasks')
      , plugin : templateDir('plugin/*')
      , command: templateDir('command/*')
    };

    this.destinations = {
        task   : sourceDir('build/tasks')
      , plugin : sourceDir('.aurelia/plugins')
      , command: sourceDir('.aurelia/commands')
    };

    this.cssDependencies = ['gulp-plumber', 'gulp-concat', 'gulp-minify-css', 'gulp-sourcemaps'];

    this.dependencies = {
        css   : this.cssDependencies
      , sass  : ['gulp-sass'].concat(this.cssDependencies)
      , less  : ['gulp-less'].concat(this.cssDependencies)
      , stylus: ['gulp-stylus'].concat(this.cssDependencies)
    };
  }

  generate(argv){
    return this.install(argv).then(function(){
      return this.create(argv);
    }.bind(this));
  }

  install(argv) {
    let self = this;
    return new Promise(function(resolve, reject){
      if (!self.dependencies[argv.task]){
        return resolve({msg:'No dependencies required!', type:'ok'});
      }
      let npm = require('npm');
      npm.load(function(err) {
        npm.commands.install(self.dependencies[argv.task], function(err, data) {
          if(err !== undefined && err !== null) {
            reject({msg:'Issue installing dependencies', type:'error', Error:err});
            console.error(err);
            throw 'Error running NPM install';
          } else {
            resolve({msg:'Dependencies installed', type:'ok', data:data});
          }
        });

        npm.on("log", function (message) {
          // log the progress of the installation
          console.log(message);
        });
      });
    });
  }

  create(argv) {
    return new Promise(function(resolve, reject){
      let source = this.templates[argv.template];
      if (argv.template === 'task') {
        source = this.templates.task(argv.task + '/*');
      }
      vynl.src(source)
        .pipe(this.rename(argv.name))
        .pipe(vynl.dest(this.destinations[argv.template]))
        .on('finish', function(){
          resolve({msg:'Complete', type:'ok'});
        })
        .on('error', function(err){
          reject({msg:'Issue creating template', error:err, type:'err'});
        });
    }.bind(this));
  }

  rename(name) {
    return rename(function(file){
      file.basename = name;
      return name;
    });
  }
}
