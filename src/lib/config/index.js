import * as logger from '../logger';
import extend from 'lodash/object/extend';
import {existsSync} from 'fs';
import {writeJSONSync} from 'fs-utils';

var basename = require('path').basename;

export class ConfigFile{
  constructor(configPath){
    this.configPath = configPath || '';
    return this;
  }

  get isConfig(){
    return existsSync(this.configPath);
  }

  get config(){
    if (!existsSync(this.configPath)) {
      return this._config;
      logger.err('config file: [%s] does not exists!', this.configPath.red);
    }
    if (!this._config || this.reload) {
      this._config = require(this.configPath);
      this.reload = false;
    }
    return this._config;
  }

  set config(value){
    extend(this._config, value);
  }

  save(config){
    config = config || {};
    this.reload = true;
    extend(this._config, config);
    writeJSONSync(this.configPath, this._config);
  }
}

export class Config{

  constructor(configPath){
    this.container = {};
  }

  registerDefaults(configPath, defaultsPath){
    this.load(configPath, defaultsPath);
  }

  load(configPath, defaultsPath){
    if (!this.container[configPath]) {
       let config = new ConfigFile(configPath);

       if (defaultsPath && !config.isConfig) {
         defaultsPath = __dirname + '/' + defaultsPath;
         config._config = require(defaultsPath);
       }

       this.container[configPath] = config;
    }
    return this.container[configPath];
  }
}

let store = store || new Config();

export default store;
