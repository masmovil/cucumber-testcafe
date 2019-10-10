import { After, AfterAll, Before, setDefaultTimeout, Status } from 'cucumber'
import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { exit } from 'process'
import { testControllerHolder } from './test-controller-holder'

// tslint:disable-next-line
const testCafe = require('testcafe')

const testController = testControllerHolder.testController
let isTestCafeError = false
let attachScreenshotToReport = null
let cafeRunner = null
let n = 0

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

function runTest(iteration, browser) {
  let runner

  testCafe('localhost', 1338 + iteration, 1339 + iteration).then(function(
    tc: any
  ) {
    cafeRunner = tc
    runner = tc.createRunner()
    return runner
      .src(RUNNER_FILE)
      .screenshots(`${process.env.CUCUMBER_REPORTS}/screenshots/`, true)
      .browsers(browser || 'chrome')
      .run({
        skipJsErrors: true,
        selectorTimeout: TIMEOUT - TIMEOUT / 5,
        assertionTimeout: TIMEOUT / 2,
        speed: 1
      })
      .catch((error: any) => {
        console.warn('Runner error count was: ', error)
      })
  })
}

setDefaultTimeout(TIMEOUT)

Before(async function(scenario) {
  const featureName = scenario.sourceLocation.uri
    .split('/')
    .slice(-1)[0]
    .split('.')[0]

  const scenarioName = scenario.pickle.name
  createTestFile(featureName, scenarioName)
  runTest(n, process.env.CUCUMBER_BROWSER || this.parameters.browser)
  n += 2
  await this.waitForTestController.then(t => {
    return t.maximizeWindow()
  })
})

After(function() {
  unlinkSync(RUNNER_FILE)
  testControllerHolder.free()
})

After(async function(testCase) {
  const world = this

  if (testCase.result.status === Status.FAILED) {
    isTestCafeError = true
    attachScreenshotToReport = world.attachScreenshotToReport
    await addErrorToController()
    await ifErrorTakeScreenshot(testController)
  }
})

AfterAll(function() {
  let intervalId = null

  function waitForTestCafe() {
    intervalId = setInterval(checkLastResponse, 500)
  }

  function checkLastResponse() {
    if (testControllerHolder.testDone()) {
      cafeRunner.close()
      clearInterval(intervalId)
      generateMultipleHtmlReport()
      exit()
    }
  }

  if (existsSync(RUNNER_FILE)) unlinkSync(RUNNER_FILE)
  waitForTestCafe()
})

const getIsTestCafeError = function() {
  return isTestCafeError
}

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

const addErrorToController = async () => {
  return testController.executionChain.catch(result => {
    const errAdapter = new testCafe.embeddingUtils.TestRunErrorFormattableAdapter(
      result,
      {
        testRunPhase: testController.testRun.phase,
        userAgent:
          testController.testRun.browserConnection.browserInfo.userAgent
      }
    )
    return testController.testRun.errs.push(errAdapter)
  })
}

const ifErrorTakeScreenshot = async resolvedTestController => {
  if (
    getIsTestCafeError() &&
    testController.testRun.opts.takeScreenshotsOnFails === true
  ) {
    if (canGenerateReport()) {
      resolvedTestController.executionChain._state = 'fulfilled'
      return resolvedTestController.takeScreenshot().then(path => {
        return getAttachScreenshotToReport(path)
      })
    } else {
      return resolvedTestController.takeScreenshot()
    }
  }
}
