import {command, option, description} from 'aurelia-command';
import ConfigFile from '../lib/configFile';
import extend from 'lodash/object/extend';
import {init} from '../lib/init';
import store from '../lib/config';
import ask from '../lib/ask';

@command('init')
@option('-e, --env', 'Initialize an aurelia project environment')
@description('Initialize a new Aurelia Project and creates an Aureliafile')
export default class InitCommand {

  constructor(config, logger) {
    this.logger = logger;
    this.globalConfig = config;
    this.configPath = process.cwd() + '/' + '.aurelia/config.json';
    this.store = store.load(this.configPath);

  }

  beforeAction(argv, options){
    if (argv.env) {
      let prompts = this.prompts();
      return ask(prompts);
    }
    return argv;

  }
  action(argv, options, answers){

    if (!argv.env) {
      console.log(argv);
      return new ConfigFile(this.globalConfig);
    } else {
      this.store.config.paths = extend(this.store.config.paths, answers);
      this.store.save();
      return {msg:'Environment created', type:'ok'};
    }
  }
  afterAction(argv, options, result){
    this.logger[result.type](result.msg);
  }

  onError(argv, options, issue){

    if (issue.msg) {
      this.logger.err(issue.msg);
    } else {
      this.logger.err(issue);
    }
    if (issue.Error) {
      this.logger.err(issue.Error);
    }
  }


  prompts(){
    let config = this.store.config;
    return [{
        name: 'plugins'
      , type: 'input'
      , message: 'Plugin Directory'
      , default: config.paths.plugins || '.aurelia/plugins'
      , validate: function(a){return !!a;}
    },{
        name: 'commands'
      , type: 'input'
      , message: 'Commands Directory'
      , default: config.paths.commands || '.aurelia/commands'
      , validate: function(a){return !!a;}
    },{
        name: 'templates'
      , type: 'input'
      , message: 'Templates Directory'
      , default: config.paths.templates || '.aurelia/templates'
      , validate: function(a){return !!a;}
    },{
        name: 'tasks'
      , type: 'input'
      , message: 'Gulp Tasks Directory'
      , default: config.paths.tasks || 'build/tasks'
      , validate: function(a){return !!a;}
    },{
        name: 'source'
      , type: 'input'
      , message: 'Project Source Directory'
      , default: config.paths.source || 'src/'
      , validate: function(a){return !!a;}
    },{
        name: 'output'
      , type: 'input'
      , message: 'Project output Directory'
      , default: config.paths.output || 'dist/'
      , validate: function(a){return !!a;}
    }];
  }
}
