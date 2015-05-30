import path from 'path';
import spawn from '../spawn-promise';
import vynl from 'vinyl-fs';
import Promise from 'bluebird';
import {isDir} from 'fs-utils';

export default class ConfigFile{
  constructor(config) {
    this.globalConfig = config;
    this.template = path.join(__dirname, 'template/*');
    this.installPath = path.join(__dirname, '../../../');
    return this.init();
  }

  get isConfigFile(){
    return !!this.globalConfig.env.configPath;
  }

  get isLocalInstalled(){
    return !!this.globalConfig.env.modulePath;
  }

  init() {
    return this.install()
      .then(function(){
        return this.create();
      }.bind(this));
  }

  install(){
    return new Promise(function(resolve, reject){
      if (!this.isLocalInstalled) {
        spawn({
          command: 'npm', args:['install', this.installPath]
        })
        .then(function(){

          resolve({msg:'aurelia-cli installed!', type:'ok'});
        })
        .catch(function(err){
          reject({msg:'Issue installing local aurelia-cli', type:'error', Error:err});
        });
      } else {
        resolve({msg:'Local aurelia-cli is already installed', type:'ok'});
      }
    }.bind(this));
  }

  create(){
    return new Promise(function(resolve, reject){
      if (!this.isConfigFile){
        vynl.src(this.template)
          .pipe(vynl.dest(process.cwd()))
          .on('finish', function(){
            let dest = process.cwd().green+'Aureliafile.js'.green;
            resolve({msg: 'Aureliafile created at ['+dest+']', type:'ok'});
          })
          .on('error', function(err){
            let dest = process.cwd().red+'Aureliafile.js'.red;
            reject({msg: 'Issue creating Aureliafile at ['+dest+']', type:'err', Error:err});
          });
      } else {
        resolve({msg:'Aureliafile File exists!', type:'ok'});
      }
    }.bind(this));
  }
}
