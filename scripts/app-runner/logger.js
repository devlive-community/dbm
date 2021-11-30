"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runnerLog = exports.electronLog = exports.rendererLog = exports.mainLog = exports.logStats = exports.greeting = void 0;
var chalk = require("chalk");
var cfonts_1 = require("cfonts");
function logStats(proc, data) {
    var log = '\n\n';
    log += chalk.yellow.bold("\u250F " + proc + " Process " + new Array((19 - proc.length) + 1).join('-'));
    log += '\n\n';
    if (typeof data === 'object') {
        data.toString({
            colors: true,
            chunks: false
        }).split(/\r?\n/).forEach(function (line) { return log += "  " + line + "\n"; });
    }
    else {
        log += "  " + data + "\n";
    }
    log += "\n" + chalk.yellow.bold("\u2517 " + new Array(28 + 1).join('-')) + "\n";
    console.log(log);
}
exports.logStats = logStats;
function printLog(target, data, color) {
    var log = '';
    data = data.toString().split(/\r?\n/);
    data.forEach(function (line) { return log += "  " + line + "\n"; });
    if (/[0-9A-z]+/.test(log)) {
        console.log(chalk[color].bold("\n\u250F " + target + " -------------------") +
            '\n\n' +
            log +
            chalk[color].bold('┗ ----------------------------') +
            '\n');
    }
}
function greeting() {
    var text = 'dbm';
    if (text) {
        cfonts_1.say(text, {
            colors: ['blue'],
            font: 'simple3d',
            space: false
        });
    }
    else {
        console.log(chalk.yellow.bold('\n  dbm'));
    }
}
exports.greeting = greeting;
function mainLog(data, color) {
    printLog('Main', data, color);
}
exports.mainLog = mainLog;
function rendererLog(data, color) {
    printLog('Renderer', data, color);
}
exports.rendererLog = rendererLog;
function electronLog(data, color) {
    printLog('Electron', data, color);
}
exports.electronLog = electronLog;
function runnerLog(data, color) {
    printLog('Runner', data, color);
}
exports.runnerLog = runnerLog;
//# sourceMappingURL=logger.js.map