"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var webpack = require("webpack");
var WaitOn = require("wait-on");
var cli_1 = require("@angular/cli");
var child_process_1 = require("child_process");
var logger_1 = require("./logger");
var webpack_main_config_1 = require("./webpack.main.config");
var electronProcess = null;
var manualRestart = false;
var hotMiddleware;
function startRenderer() {
    cli_1.default({ cliArgs: ['serve', '--configuration', 'development'] })
        .then(function (result) { return logger_1.rendererLog(result, 'blue'); })
        .catch(function (err) { return logger_1.rendererLog(err, 'red'); });
    return WaitOn({ resources: ['tcp:4200'] }).then(function () {
        logger_1.rendererLog('The renderer process is running at port 4200!', 'blue');
    });
}
function startMain() {
    return new Promise(function (resolve, reject) {
        var compiler = webpack.webpack(webpack_main_config_1.default);
        compiler.hooks.watchRun.tapAsync('watch-run', function (compilation, done) {
            logger_1.mainLog('compiling...', 'white');
            done();
        });
        compiler.watch({}, function (err, stats) {
            if (err) {
                logger_1.mainLog(err, 'red');
                return;
            }
            logger_1.logStats('Main', stats);
            if (!electronProcess || electronProcess.killed) {
                return resolve();
            }
            manualRestart = true;
            process.kill(electronProcess.pid);
            electronProcess = null;
            startElectron();
            setTimeout(function () { return manualRestart = false; }, 5000);
        });
    });
}
function startElectron() {
    var args = [
        '--inspect=5858',
        path.join(__dirname, '../../dist/main/main.js')
    ];
    if (process.env.npm_execpath.endsWith('yarn.js')) {
        args.push.apply(args, process.argv.slice(3));
    }
    if (process.env.npm_execpath.endsWith('npm-cli.js')) {
        args.push.apply(args, process.argv.slice(2));
    }
    electronProcess = child_process_1.spawn(require('electron'), args);
    electronProcess.stdout.on('data', function (data) { return logger_1.electronLog(data, 'blue'); });
    electronProcess.stderr.on('data', function (data) { return logger_1.electronLog(data, 'red'); });
    electronProcess.on('close', function () {
        if (!manualRestart) {
            process.exit();
        }
    });
}
function init() {
    logger_1.greeting();
    Promise
        .all([startRenderer(), startMain()]).then(startElectron)
        .catch(function (err) { return logger_1.runnerLog(err, 'red'); });
}
init();
//# sourceMappingURL=index.js.map