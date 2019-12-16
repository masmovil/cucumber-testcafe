#!/usr/bin/env node
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// tslint:disable:no-console
var fs = require('fs-extra');
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var pkg = require('../../package.json');
clear();
console.log(chalk.red(figlet.textSync('cucumber', { horizontalLayout: 'full' })));
console.log(chalk.red(figlet.textSync('         +', { horizontalLayout: 'full' })));
console.log(chalk.red(figlet.textSync('testcafe', { horizontalLayout: 'full' })));
console.log(chalk.green(pkg.version));
program.version(pkg.version).description('cucumber-testcafe CLI');
var EXAMPLE_PROJECT_DIR = __dirname + "/../../example-project";
program
    .command('init [folder]')
    .description('Creates basic test scaffolding')
    .action(function (folder) {
    var dest = process.cwd() + '/' + (folder || 'test');
    console.log('Generating test folder in', dest);
    fs.copySync(EXAMPLE_PROJECT_DIR + '/test', dest, {
        filter: function (src) {
            return !src.includes('node_modules');
        }
    });
    fs.copySync(EXAMPLE_PROJECT_DIR + '/cucumber.profiles.json', dest + '/../cucumber.profiles.json');
    // copy vscode settings
    var exampleVSCodeSettings = JSON.parse(fs.readFileSync(EXAMPLE_PROJECT_DIR + '/.vscode/settings.json', 'utf8'));
    exampleVSCodeSettings['cucumberautocomplete.steps'] = [
        dest + '/steps/*.sd.ts',
        'node_modules/cucumber-testcafe/dist/lib/steps/*.sd.js'
    ];
    exampleVSCodeSettings['cucumberautocomplete.syncfeatures'] =
        dest + '/steps/*.feature';
    if (fs.existsSync(dest + '/../.vscode/settings.json')) {
        var destVSCodeSettings = JSON.parse(fs.readFileSync(dest + '/../.vscode/settings.json', 'utf8'));
        fs.writeFileSync(dest + '/../.vscode/settings.json', JSON.stringify(__assign(__assign({}, destVSCodeSettings), exampleVSCodeSettings), null, 2));
    }
    else {
        fs.copySync(EXAMPLE_PROJECT_DIR + '/.vscode', dest + '/../.vscode');
        fs.writeFileSync(dest + '/../.vscode/settings.json', JSON.stringify(exampleVSCodeSettings, null, 2));
    }
    // add cucumber-testcafe command to packag.json scripts
    if (fs.existsSync(dest + '/../package.json')) {
        var destPkg = JSON.parse(fs.readFileSync(dest + '/../package.json', 'utf8'));
        destPkg.scripts['cucumber-testcafe'] = 'cucumber-testcafe run';
        fs.writeFileSync(dest + '/../package.json', JSON.stringify(destPkg, null, 2));
    }
    else {
        fs.copySync(EXAMPLE_PROJECT_DIR + '/.vscode', dest + '/../.vscode');
    }
});
program
    .command('run')
    .description('Runs all detected gherkin specs')
    .action(function () {
    process.env.CUCUMBER_CWD = process.env.CUCUMBER_CWD || process.cwd();
    var profile = require('../lib/profile-loader');
    var cucumber = require('cucumber');
    var cli = new cucumber.Cli({
        argv: __spreadArrays([null, __filename], profile),
        cwd: process.env.CUCUMBER_CWD,
        stdout: process.stdout
    });
    return cli.run().then(function (response) {
        if (!response.success) {
            process.exit(1);
        }
        return response;
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map