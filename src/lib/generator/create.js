import rename from 'gulp-rename';
import path from 'path';
import vynl from 'vinyl-fs';
import Promise from 'bluebird';
export default class Generator{

  constructor() {
    let templateDir = path.join.bind(path, __dirname, 'templates');
    let sourceDir   = path.join.bind(path, process.cwd());

    this.templates = {
        task   : templateDir('task/*')
      , plugin : templateDir('plugin/*')
      , command: templateDir('command/*')
    };

    this.destinations = {
        task   : sourceDir('build/tasks')
      , plugin : sourceDir('.aurelia/plugins')
      , command: sourceDir('.aurelia/commands')
    };
  }

  create(argv) {
    return new Promise(function(resolve, reject){
      vynl.src(this.templates[argv.template])
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
