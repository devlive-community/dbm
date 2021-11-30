import * as path from 'path';
import * as webpack from 'webpack';
import * as WaitOn from 'wait-on';
import NgCli from '@angular/cli';
import { spawn } from 'child_process';
import { electronLog, greeting, logStats, mainLog, rendererLog, runnerLog } from './logger';

import mainConfig from './webpack.main.config';

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;

function startRenderer(): Promise<void> {
  NgCli({cliArgs: ['serve', '--configuration', 'development']})
  .then(result => rendererLog(result, 'blue'))
  .catch((err) => rendererLog(err, 'red'));

  return WaitOn({resources: ['tcp:4200']}).then(() => {
    rendererLog('The renderer process is running at port 4200!', 'blue');
  });
}

function startMain(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const compiler = webpack.webpack(mainConfig);

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      mainLog('compiling...', 'white');
      done();
    });

    compiler.watch({}, (err, stats) => {
      if (err) {
        mainLog(err, 'red');
        return;
      }

      logStats('Main', stats);

      if (!electronProcess || electronProcess.killed) {
        return resolve();
      }

      manualRestart = true;
      process.kill(electronProcess.pid);
      electronProcess = null;
      startElectron();

      setTimeout(() => manualRestart = false, 5000);
    });
  });
}

function startElectron(): void {
  const args = [
    '--inspect=5858',
    path.join(__dirname, '../../dist/main/main.js')
  ];

  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args.push(...process.argv.slice(3));
  }
  if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args.push(...process.argv.slice(2));
  }


  electronProcess = spawn(require('electron') as unknown as string, args);

  electronProcess.stdout.on('data', data => electronLog(data, 'blue'));
  electronProcess.stderr.on('data', data => electronLog(data, 'red'));

  electronProcess.on('close', () => {
    if (!manualRestart) {
      process.exit();
    }
  });
}

function init(): void {
  greeting();

  Promise
  .all([startRenderer(), startMain()]).then(startElectron)
  .catch(err => runnerLog(err, 'red'));
}

init();
