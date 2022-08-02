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
  pluginsPath: 'node_modules',
  reportHTML: false,
  baseURL: 'http://localhost:4200',
  timeout: 10000,
  parallel: 1,
  retry: 0,
}

function cucumberProfileArgs(profile) {
  const mergedProfile = {
    ...defaultProfile,
    ...profile,
    require: [...defaultProfile.require, ...(profile.require || [])],
  }

  process.env.CUCUMBER_PLUGINS =
    process.env.CUCUMBER_PLUGINS || mergedProfile.pluginsPath
  process.env.CUCUMBER_REPORTS =
    process.env.CUCUMBER_REPORTS || mergedProfile.reports
  process.env.CUCUMBER_BROWSER =
    process.env.CUCUMBER_BROWSER || mergedProfile.browser
  process.env.SUBMNGURL = process.env.SUBMNGURL || mergedProfile.SUBMNGURL
  process.env.ZENDSKURL = process.env.ZENDSKURL || mergedProfile.ZENDSKURL
  process.env.SVMXURL = process.env.SVMXURL || mergedProfile.SVMXURL
  process.env.CUCUMBER_HTML =
    process.env.CUCUMBER_HTML || mergedProfile.reportHTML
  process.env.CUCUMBER_TIMEOUT =
    process.env.CUCUMBER_TIMEOUT || mergedProfile.timeout
  process.env.CUCUMBER_BASEURL =
    process.env.CUCUMBER_BASEURL || mergedProfile.baseURL
  process.env.CUCUMBER_DXADMIN_URL =
    process.env.CUCUMBER_DXADMIN_URL || mergedProfile.dxAdminURL
  process.env.CUCUMBER_TAGS = process.env.CUCUMBER_TAGS || mergedProfile.tags
  process.env.RESOLUTION = process.env.RESOLUTION || mergedProfile.resolution
  mergedProfile.reports = process.env.CUCUMBER_REPORTS || mergedProfile.reports
  mergedProfile.browser = process.env.CUCUMBER_BROWSER || mergedProfile.browser
  mergedProfile.reportHTML =
    process.env.CUCUMBER_HTML || mergedProfile.reportHTML
  mergedProfile.timeout = process.env.CUCUMBER_TIMEOUT || mergedProfile.timeout
  mergedProfile.baseURL = process.env.CUCUMBER_BASEURL || mergedProfile.baseURL
  mergedProfile.tags = process.env.CUCUMBER_TAGS || mergedProfile.tags
  console.info('computed profile: ', mergedProfile)

  const args = [
    ...mergedProfile.paths,
    ...mergedProfile.formatters,

    ...mergedProfile.requireModule.map((requiredModule) => [
      '--require-module',
      requiredModule,
    ]),
    ...mergedProfile.require.map((required) => ['--require', required]),

    `--tags`,
    `${mergedProfile.tags}`,

    `--parallel`,
    `${mergedProfile.parallel}`,
    `--retry`,
    `${mergedProfile.retry}`,
  ]

  return flattenDeep(args)
}

const config = require(`${process.env.CUCUMBER_CWD}/cucumber.profiles.js`)[
  process.env.CUCUMBER_PROFILE || 'default'
]

module.exports = cucumberProfileArgs(config)
