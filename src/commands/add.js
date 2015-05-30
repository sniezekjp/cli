import {command, option, description, arg, instance} from 'aurelia-command';
import path from 'path';
import {map, extend} from 'lodash';
import {ask} from '../lib/ask';
import Generator from '../lib/generator/create';

@command('add')
@arg('<template>', '<name>')
@option('-r, --repo', 'Create a new aurelia-plugin repo')
@instance(Generator)
export default class AddCommand{


  constructor(config, logger, generator){
    this.globalConfig = config;
    this.logger       = logger;
    this.generator    = generator;

    this.templates = ['command', 'plugin', 'task'];
    this.tasks     = ['es6', 'es5', 'lint', 'css', 'less', 'sass', 'stylus', 'default'];
  }

  beforeAction(argv, options){
    let prompts = this.prompts(argv);
    return ask(prompts)
      .then(function(answers) {
        return extend(answers, argv);
      });
  }

  action(argv, options, answers){
    return this.generator.create(answers);
  }

  afterAction(argv, options, result) {
    this.logger[result.type](result.msg);
  }

  onError(argv, options, reason){
    console.log(reason);
    // this.logger[reason.type](reason.msg);
    // this.logger[reason.type](reason.error);
  }

  prompts(argv){
    return [{
          name: 'template'
        , type: 'list'
        , message: 'Template?'
        , default: 'task'
        , choices: map(this.templates, function(name){return {name:name, value:name};})
        , when: function(){
          return !argv.template;
        }
      },{
          name: 'name'
        , type: 'input'
        , message: 'Name?'
        , when: function(){
          return !argv.name;
        }
      },{
          name: 'repo'
        , type: 'confirm'
        , message: 'Create a new Aurelia-plugin Repo?'
        , when: function(answers) {
            return argv.template === 'plugin' || answers.template === 'plugin';
        }
      },{
          name: 'task'
        , type: 'list'
        , message: 'What kind of gulp task?'
        , choices: map(this.tasks, function(name){return {name:name, value:name};})
        , when: function(answers) {
            return argv.template === 'task' || answers.template === 'task';
        }
      }];
  }
}
