const detect = require('detect-port');
const chalk = require('chalk');
const isRoot = require('is-root');
const clearConsole = require('./clearConsole');


const isInteractive = process.stdout.isTTY;


// 选择启动端口
function choosePort(host, defaultPort) {
  return detect(defaultPort, host).then(
    port =>
      new Promise(resolve => {
        if (port === defaultPort) {
          return resolve(port);
        }
        const message =
          process.platform !== 'win32' && defaultPort < 1024 && !isRoot()
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`;
        if (isInteractive) {
          clearConsole();
          const question = {
            type: 'confirm',
            name: 'shouldChangePort',
            message: chalk.yellow(message) + '\n\nWould you like to run the app on another port instead?',
            initial: true
          };
          prompts(question).then(answer => {
            if (answer.shouldChangePort) {
              resolve(port);
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(chalk.red(message));
          resolve(null);
        }
      }),
    err => {
      throw new Error(chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) + '\n' + ('Network error message: ' + err.message || err) + '\n');
    }
  );
}

module.exports = {
  choosePort
};
