"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
process.env.BABEL_ENV = 'main';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var path_1 = require("path");
var dependencies = require('../../package.json').dependencies;
var mainConfig = {
    mode: process.env.NODE_ENV,
    target: 'electron-main',
    devtool: 'source-map',
    entry: {
        main: path_1.resolve(__dirname, '../../src/main/main.ts')
    },
    output: {
        filename: '[name].js',
        path: path_1.resolve(__dirname, '../../dist/main'),
        libraryTarget: 'commonjs',
    },
    externals: __spreadArray([], dependencies),
    node: {
        __dirname: process.env.NODE_ENV !== 'production',
        __filename: process.env.NODE_ENV !== 'production'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path_1.resolve(__dirname, '../../src/tsconfig.main.json'),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [],
    resolve: {
        extensions: ['.ts', '.json', '.js']
    },
};
if (process.env.NODE_ENV !== 'production') {
}
if (process.env.NODE_ENV === 'production') {
}
exports.default = mainConfig;
//# sourceMappingURL=webpack.main.config.js.map