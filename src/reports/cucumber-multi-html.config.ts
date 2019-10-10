const reporter = require('multiple-cucumber-html-reporter')

const options = {
  jsonDir: process.env.CUCUMBER_REPORTS,
  reportPath: process.env.CUCUMBER_REPORTS,
  reportName: 'You can adjust this report name',
  customMetadata: false,
  displayDuration: true,
  durationInMS: true,
  disableLog: true,
  metadata: {
    browser: {
      name: '.'
    },
    device: '.',
    platform: {
      name: '.',
      version: '.'
    }
  }
}

reporter.generate(options)
