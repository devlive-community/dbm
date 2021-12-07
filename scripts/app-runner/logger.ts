import * as chalk from 'chalk';
import { say } from 'cfonts';

function logStats(proc: string, data: string | any): void {
  let log = '\n\n';

  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`);
  log += '\n\n';

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => log += `  ${line as string}\n`);
  } else {
    log += `  ${data as string}\n`;
  }

  log += `\n${chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`)}\n`;

  console.log(log);
}

function printLog(target: string, data: any, color: string): void {
  let log = '';

  data = data.toString().split(/\r?\n/);
  data.forEach(line => log += `  ${line as string}\n`);

  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold(`\n┏ ${target} -------------------`) +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    );
  }
}

function greeting(): void {
  const text = 'dbm';
  if (text) {
    say(text, {
      colors: ['blue'],
      font: 'simple3d',
      space: false
    });
  } else {
    console.log(chalk.yellow.bold('\n  dbm'));
  }
}

function mainLog(data: any, color: string): void {
  printLog('Main', data, color);
}

function rendererLog(data: any, color: string): void {
  printLog('Renderer', data, color);
}

function electronLog(data: any, color: string): void {
  printLog('Electron', data, color);
}

function runnerLog(data: any, color: string): void {
  printLog('Runner', data, color);
}

export {
  greeting,
  logStats,
  mainLog, rendererLog, electronLog, runnerLog
};
