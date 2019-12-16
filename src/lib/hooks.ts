import { After, AfterAll, Before, setDefaultTimeout, Status } from 'cucumber'
import { existsSync, unlinkSync, writeFileSync } from 'fs'
import { exit } from 'process'
import { testControllerHolder } from './test-controller-holder'
import { testController } from './world'

// tslint:disable-next-line
const testCafe = require('testcafe')

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

  return testCafe('localhost').then(function(tc: any) {
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
        selectorTimeout: TIMEOUT / 5,
        assertionTimeout: TIMEOUT / 10,
        debugOnFail: !!process.env.CUCUMBER_DEBUG
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
  runTest(process.env.CUCUMBER_BROWSER || this.parameters.browser)

  return this.waitForTestController.then(t => t.maximizeWindow())
})

After(async function(testCase) {
  const world = this

  if (testCase.result.status === Status.FAILED) {
    attachScreenshotToReport = world.attachScreenshotToReport
    await addErrorToController()
    await ifErrorTakeScreenshot(testController)
  }

  if (existsSync(RUNNER_FILE)) unlinkSync(RUNNER_FILE)
  await testControllerHolder.free()
  await testController.wait(500)
  await cafeRunner.close()
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
      generateMultipleHtmlReport()
    }
    clearInterval(intervalId)
    exit()
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

const addErrorToController = async() => {
  return testController.executionChain.catch(result => {
    const errAdapter = new testCafe.embeddingUtils.TestRunErrorFormattableAdapter(
      result,
      {
        testRunPhase: testController.testRun.phase,
        userAgent: testController.testRun.browserConnection.browserInfo.userAgent
      }
    )
    return testController.testRun.errs.push(errAdapter)
  })
}

const ifErrorTakeScreenshot = async resolvedTestController => {
  console.log(resolvedTestController)
  if (testController.testRun.opts.takeScreenshotsOnFails === true) {
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
