const reporter = require('multiple-cucumber-html-reporter')

const options = {
  jsonDir: process.env.CUCUMBER_REPORTS,
  reportPath: process.env.CUCUMBER_REPORTS,
  reportName: process.env.CUCUMBER_REPORT_NAME || 'You can adjust this report name',
  customMetadata: false,
  displayDuration: process.env.CUCUMBER_REPORT_DISPLAY_DURATION,
  durationInMS: process.env.CUCUMBER_REPORT_DURATION_MS,
  disableLog: true,
  metadata: {
    browser: {
      name: process.env.CUCUMBER_BROWSER || '.'
    },
    device: '.',
    platform: {
      name: process.env.CUCUMBER_BROWSER || '.',
      version: '.'
    }
  }
}

reporter.generate(options)
