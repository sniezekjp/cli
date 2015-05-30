import {init} from '../lib/init';
import {command, option, description} from 'aurelia-command';

@command('init')
@option('-e, --env', 'Initialize an aurelia project environment')
@description('Initialize a new Aurelia Project and creates an Aureliafile')
export default class InitCommand {

  constructor(config, logger) {
    this.logger = logger;
    this.globalConfig = config;
  }

  beforeAction(){
    console.log('before');
  }
  action(argv, options){
    console.log('action');
  }
  afterAction(argv, options){
    console.log('after');
  }
}
