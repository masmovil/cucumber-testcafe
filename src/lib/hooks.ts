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
      .screenshots(`${process.env.CUCUMBER_REPORTS}/screenshots/`, true)
      .browsers(browser || 'chrome')
      .run({
        skipJsErrors: true,
        selectorTimeout: TIMEOUT / 2,
        assertionTimeout: TIMEOUT / 2
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

After(function() {
  if (existsSync(RUNNER_FILE)) unlinkSync(RUNNER_FILE)
  testControllerHolder.free()
})

After(async function(testCase) {
  const world = this

  if (testCase.result.status === Status.FAILED) {
    isTestCafeError = true
    attachScreenshotToReport = world.attachScreenshotToReport
    await addErrorToController(testCase.result)
    await ifErrorTakeScreenshot(testController)
  }
})

AfterAll(function() {
  let intervalId = null

  function waitForTestCafe() {
    intervalId = setInterval(checkLastResponse, 500)
  }

  function checkLastResponse() {
    if (
      testController.testRun.lastDriverStatusResponse ===
      'test-done-confirmation'
    ) {
      cafeRunner.close()
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
    isTestCafeError &&
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
