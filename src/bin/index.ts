#!/usr/bin/env node

// tslint:disable:no-console
const fs = require('fs-extra')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const path = require('path')
const program = require('commander')

const pkg = require('../../package.json')

clear()
console.log(
  chalk.red(figlet.textSync('cucumber', { horizontalLayout: 'full' }))
)
console.log(
  chalk.red(figlet.textSync('         +', { horizontalLayout: 'full' }))
)
console.log(
  chalk.red(figlet.textSync('testcafe', { horizontalLayout: 'full' }))
)
console.log(chalk.green(pkg.version))

program.version(pkg.version).description('cucumber-testcafe CLI')

const EXAMPLE_PROJECT_DIR = `${__dirname}/../../example-project`

program
  .command('init [folder]')
  .description('Creates basic test scaffolding')
  .action(function(folder) {
    const dest = process.cwd() + '/' + (folder || 'test')

    console.log('Generating test folder in', dest)

    fs.copySync(EXAMPLE_PROJECT_DIR + '/test', dest, {
      filter: src => {
        return !src.includes('node_modules')
      }
    })

    fs.copySync(
      EXAMPLE_PROJECT_DIR + '/cucumber.profiles.json',
      dest + '/../cucumber.profiles.json'
    )

    // copy vscode settings
    const exampleVSCodeSettings = JSON.parse(
      fs.readFileSync(EXAMPLE_PROJECT_DIR + '/.vscode/settings.json', 'utf8')
    )
    exampleVSCodeSettings['cucumberautocomplete.steps'] = [
      dest + '/steps/*.sd.ts',
      'node_modules/cucumber-testcafe/dist/lib/steps/*.sd.js'
    ]
    exampleVSCodeSettings['cucumberautocomplete.syncfeatures'] =
      dest + '/steps/*.feature'
    if (fs.existsSync(dest + '/../.vscode/settings.json')) {
      const destVSCodeSettings = JSON.parse(
        fs.readFileSync(dest + '/../.vscode/settings.json', 'utf8')
      )
      fs.writeFileSync(
        dest + '/../.vscode/settings.json',
        JSON.stringify(
          { ...destVSCodeSettings, ...exampleVSCodeSettings },
          null,
          2
        )
      )
    } else {
      fs.copySync(EXAMPLE_PROJECT_DIR + '/.vscode', dest + '/../.vscode')
      fs.writeFileSync(
        dest + '/../.vscode/settings.json',
        JSON.stringify(exampleVSCodeSettings, null, 2)
      )
    }

    // add cucumber-testcafe command to packag.json scripts
    if (fs.existsSync(dest + '/../package.json')) {
      const destPkg = JSON.parse(
        fs.readFileSync(dest + '/../package.json', 'utf8')
      )
      destPkg.scripts['cucumber-testcafe'] = 'cucumber-testcafe run'

      fs.writeFileSync(
        dest + '/../package.json',
        JSON.stringify(destPkg, null, 2)
      )
    } else {
      fs.copySync(EXAMPLE_PROJECT_DIR + '/.vscode', dest + '/../.vscode')
    }
  })

program
  .command('run')
  .description('Runs all detected gherkin specs')
  .action(function() {
    process.env.CUCUMBER_CWD = process.env.CUCUMBER_CWD || process.cwd()

    const profile = require('../lib/profile-loader')

    const cucumber = require('cucumber')

    const cli = new cucumber.Cli({
      argv: [null, __filename, ...profile],
      cwd: process.env.CUCUMBER_CWD,
      stdout: process.stdout
    })

    return cli.run().then(response => {
      if (process.env.CUCUMBER_HTML) {
        try {
          require('../reports/cucumber-multi-html.config')
        } catch (error) {
          console.warn('Could not generate cucumber html report', error)
        }
      }
      if (!response.success) {
        process.exit(1)
      }
      return response
    })
  })

program.parse(process.argv)
