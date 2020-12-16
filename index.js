#! /usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const boxen = require('boxen');
const glob = require('glob');
const { statSync } = require('fs');

const CLI_VERSION = '1.0.0'

const BOXEN_OPTS = {
  padding: 1,
  margin: 1,
  align: 'center',
  borderColor: '#678491',
  borderStyle: 'round',
};

function initializing(version) {
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
  console.log(boxen(messages.join('\n'), BOXEN_OPTS));
}

program
  .version(CLI_VERSION, '-v, --version')
  .usage('<command> [options] <app-name> [folder-name]')
  .option('-c, --clone', 'use git clone')
  .on('--help', () => {
    console.log();
    console.log('Examples:');
    console.log();
    console.log(
      chalk.gray('  # create a new react project'),
    );
    console.log('  $ enzomi init project');
    console.log();
  });

program.command('init <name>')
  .description('generate a new project from a template')
  .option('-c, --clone', 'use git clone') // set the program
  .action((name) => {
    initializing(CLI_VERSION)
    if (!fs.existsSync(name)) {
      inquirer.prompt([
        {
          name: 'description',
          message: '请输入项目描述',
        },
        {
          name: 'author',
          message: '请输入作者名称',
        },
      ]).then((answers) => {
        const spinner = ora('正在下载模板...');
        spinner.start();
        download('https://github.com/lorenzohee/miniapp-cli.git/page/page.json', name, { clone: true }, (err) => {
          if (err) {
            spinner.fail();
            console.log(symbols.error, chalk.red(err));
          } else {
            spinner.succeed();
            const fileName = `${name}/package.json`;
            const meta = {
              name,
              description: answers.description,
              author: answers.author,
            }
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(symbols.success, chalk.green('项目初始化完成'));
          }
        })
        glob
          .sync('**/*', {
            cwd: './templates',
            dot: true,
          })
          .forEach((file) => {
            const filePath = `./templates${file}`;
            if (statSync(filePath).isFile()) {
              this.fs.copyTpl(
                this.templatePath(filePath),
                this.destinationPath(file.replace(/^_/, '.')),
                { name: this.name },
              );
            }
          });
      })
    } else {
      // 错误提示项目已存在，避免覆盖原有项目
      console.log(symbols.error, chalk.red('项目已存在'));
    }
  })
program.parse(process.argv);
