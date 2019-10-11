function flattenDeep(arr1) {
  return arr1.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  )
}

const defaultProfile = {
  paths: ['test/**/*.feature'],
  requireModule: [],
  require: [`${__dirname}/**/*.js`],
  tags: 'not @ignore',
  browser: 'chrome',
  reports: 'test/reports',
  reportHTML: false,
  baseURL: 'http://localhost:4200',
  timeout: 20000
}

function cucumberProfileArgs(profile) {
  const mergedProfile = {
    ...defaultProfile,
    ...profile,
    require: [...defaultProfile.require, ...(profile.require || [])]
  }

  process.env.CUCUMBER_REPORTS = mergedProfile.reports
  process.env.CUCUMBER_BROWSER = mergedProfile.browser
  process.env.CUCUMBER_HTML = mergedProfile.reportHTML
  process.env.CUCUMBER_TIMEOUT = mergedProfile.timeout
  process.env.CUCUMBER_BASEURL = mergedProfile.baseURL

  const args = [
    ...mergedProfile.paths,
    ...mergedProfile.requireModule.map(requiredModule => [
      '--require-module',
      requiredModule
    ]),
    ...mergedProfile.require.map(required => ['--require', required]),
    '--format',

    `json:${mergedProfile.reports}/report.json`,
    `--tags`,
    `${mergedProfile.tags}`
  ]

  return flattenDeep(args)
}

const config = require(process.argv[2] ||
  `${process.env.CUCUMBER_CWD}/cucumber.profiles.json`)[
  process.env.CUCUMBER_PROFILE || 'default'
]

module.exports = cucumberProfileArgs(config)
