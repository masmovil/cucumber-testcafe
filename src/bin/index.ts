#!/usr/bin/env node

process.env.CUCUMBER_CWD = process.env.CUCUMBER_CWD || process.cwd()

const profile = require('../lib/profile-loader')

const cucumber = require('cucumber')

const cli = new cucumber.Cli({
  argv: [null, __filename, ...profile],
  cwd: process.env.CUCUMBER_CWD,
  stdout: process.stdout
})

cli.run().then(success => +success)
