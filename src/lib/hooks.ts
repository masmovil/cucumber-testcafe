import { After, AfterAll, Before, setDefaultTimeout, Status } from 'cucumber'
import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { exit } from 'process'
import { testControllerHolder } from './test-controller-holder'
import { testController } from './world'

// tslint:disable-next-line
const testCafe = require('testcafe')

let isTestCafeError = false
let attachScreenshotToReport = null
let cafeRunner = null

const TIMEOUT = +process.env.CUCUMBER_TIMEOUT || 20000
const RUNNER_FILE = `${process.env.CUCUMBER_CWD}/test/runner.js`
const delay = ms => new Promise(res => setTimeout(res, ms))

function createTestFile(featureName = '', scenarioName = '') {
  writeFileSync(
    RUNNER_FILE,
    `import { testControllerHolder } from "cucumber-testcafe";\n` +
      `fixture("${featureName}")\n` +
      `test("${scenarioName}", testControllerHolder.capture)`
  )
}

function runTest(browser) {
  let runner

  testCafe('localhost').then(function(tc: any) {
    cafeRunner = tc
    runner = tc.createRunner()
    return runner
      .src(RUNNER_FILE)
      .screenshots({
        path: `${process.env.CUCUMBER_REPORTS}/screenshots/`,
        takeOnFails: true
      })
      .browsers(browser || 'chrome')
      .reporter([
        'spec',
        {
          name: 'json',
          output: `${process.env.CUCUMBER_REPORTS}/report.json`
        }
      ])
      .run({
        skipJsErrors: true,
        selectorTimeout: TIMEOUT,
        assertionTimeout: 10000,
        debugOnFail: !!process.env.CUCUMBER_DEBUG
      })
      .catch((error: any) => {
        console.warn('Runner error count was: ', error)
      })
  })
}

setDefaultTimeout(TIMEOUT)

Before(async function(scenario) {
  const scenarioName = scenario.pickle.name
  const featureName = scenario.sourceLocation.uri
    .split('/')
    .slice(-1)[0]
    .split('.')[0]

  createTestFile(featureName, scenarioName)
  runTest(process.env.CUCUMBER_BROWSER || this.parameters.browser)

  await this.waitForTestController.then(t => t.maximizeWindow())
})

After(async function(testCase) {
  const world = this

  if (testCase.result.status === Status.FAILED) {
    attachScreenshotToReport = world.attachScreenshotToReport
    await addErrorToController(testCase.result)
    await ifErrorTakeScreenshot(testController)
  }

  testControllerHolder.free()
  await delay(500)
  cafeRunner.close()
})

AfterAll(function() {
  if (existsSync(RUNNER_FILE)) unlinkSync(RUNNER_FILE)

  let intervalId = null

  function waitForTestCafe() {
    intervalId = setInterval(checkLastResponse, 500)
  }

  function checkLastResponse() {
    if (
      testController.testRun.lastDriverStatusResponse ===
      'test-done-confirmation'
    ) {
      clearInterval(intervalId)
      generateMultipleHtmlReport()
      exit(+isTestCafeError)
    }
  }

  waitForTestCafe()
})

const getAttachScreenshotToReport = path => {
  return attachScreenshotToReport(path)
}

const canGenerateReport = (): boolean => {
  return (
    process.argv.includes('--format') ||
    process.argv.includes('-f') ||
    process.argv.includes('--format-options')
  )
}

function generateMultipleHtmlReport() {
  if (process.env.CUCUMBER_HTML) {
    try {
      require('../reports/cucumber-multi-html.config.js')
    } catch (error) {
      console.warn('Could not generate cucumber html report', error)
    }
  }
}

const addErrorToController = async error => {
  const errAdapter = new testCafe.embeddingUtils.TestRunErrorFormattableAdapter(
    error,
    {
      testRunPhase: testController.testRun.phase,
      userAgent: testController.testRun.browserConnection.browserInfo.userAgent
    }
  )
  return testController.testRun.errs.push(errAdapter)
}

const ifErrorTakeScreenshot = async resolvedTestController => {
  if (
    testController.testRun.opts.takeScreenshotsOnFails === true
  ) {
    if (canGenerateReport()) {
      resolvedTestController.executionChain._state = 'fulfilled'
      return resolvedTestController
        .takeScreenshot()
        .then(path => getAttachScreenshotToReport(path))
    } else {
      return resolvedTestController.takeScreenshot()
    }
  }
}
