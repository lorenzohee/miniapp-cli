const Generator = require('yeoman-generator');
const boxen = require('boxen');
const chalk = require('chalk');

const CLI_VERSION = '1.0.0'

const BOXEN_OPTS = {
  padding: 1,
  margin: 1,
  align: 'center',
  borderColor: '#678491',
  borderStyle: 'round',
};

module.exports = class extends Generator {
  // note: arguments and options should be defined in the constructor.
  constructor(args, opts) {
    super(args, opts);

    // This makes `appname` a required argument.
    this.argument('projectname', { type: String, required: true });
  }

  // Your initialization methods (checking current project state, getting configs, etc)
  initializing() {
    this._initializing(CLI_VERSION)
  }

  // - Where you prompt users for options (where you’d call this.prompt())
  async prompting() {
    const projectInfo = await this.prompt([
      {
        type: 'input',
        name: 'description',
        message: '请输入项目描述：',
        default: this.options.projectname, // Default to current folder name
      },
      {
        type: 'input',
        name: 'author',
        message: '请输入作者姓名：',
        default: 'Lorenzo',
      },
    ])
    this.config.set({
      description: projectInfo.description,
      author: projectInfo.author,
    })
  }

  // Saving configurations and configure the project
  // (creating .editorconfig files and other metadata files)
  configuring() {
    this.copyTemplate('./app.json', `${this.options.projectname}/app.json`)
    this.copyTemplate('./app.wxss', `${this.options.projectname}/app.wxss`)
    this.copyTemplate('./app.js', `${this.options.projectname}/app.js`)
    this.copyTemplate('./sitemap.json', `${this.options.projectname}/sitemap.json`)
    this.copyTemplate('./utils', `${this.options.projectname}/utils`)
    this.copyTemplate('./vendor', `${this.options.projectname}/vendor`)
    this.copyTemplate('./pages', `${this.options.projectname}/pages`)
    this.fs.copyTpl(this.templatePath('./project.config.json'), this.destinationPath(`${this.options.projectname}/project.config.json`), { projectName: this.options.projectname });
  }

  // - If the method name doesn’t match a priority, it will be pushed to this group.
  default() {
    this.log('default')
  }

  // - Where you write the generator specific files (routes, controllers, etc)
  writing() {
    this.log('writing')
  }

  // - Where conflicts are handled (used internally)
  conflicts() {
    this.log('conflicts')
  }

  // - Where installations are run (npm, bower)
  install() {
    this.log('install')
  }

  // Called last, cleanup, say good bye, etc
  end() {
    this.log('end')
  }

  method1() {
    this.log('method 1 just ran');
  }

  method2() {
    this.log('method 2 just ran');
    this.log(this.contextRoot)
  }

  _method3() {
    this.log('method 3')
  }

  async _prompting() {
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.options.projectname, // Default to current folder name
      },
      {
        type: 'confirm',
        name: 'cool',
        message: 'Would you like to enable the Cool feature?',
      },
    ])
    this.log('app name', answers.name);
    this.log('cool feature', answers.cool);
  }

  _initializing(version) {
    const messages = [];
    messages.push(
      `🔥  Welcome to use hopemin-cli ${chalk.grey(`v${version}`)}`,
    );
    messages.push(
      chalk.grey('https://github.com/lorenzohee/miniapp-cli/'),
    );
    messages.push(
      chalk.grey('https://innovationroad.site'),
    )
    this.log(boxen(messages.join('\n'), BOXEN_OPTS));
  }
};
