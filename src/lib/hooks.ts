import { After, Before, setDefaultTimeout, Status } from 'cucumber'
import { existsSync, unlinkSync, writeFileSync } from 'fs'
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
      .run({
        skipJsErrors: true,
        selectorTimeout: TIMEOUT / 5,
        assertionTimeout: TIMEOUT / 10,
        debugOnFail: !!process.env.CUCUMBER_DEBUG
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
    await addErrorToController(testController)
    await ifErrorTakeScreenshot(testController)
  }

  if (existsSync(RUNNER_FILE)) unlinkSync(RUNNER_FILE)
  await testControllerHolder.free()
  return cafeRunner.close()
})

const getAttachScreenshotToReport = path => {
  return attachScreenshotToReport(path)
}

const addErrorToController = async resolvedTestController => {
  return resolvedTestController.executionChain.catch(result => {
    const errAdapter = new testCafe.embeddingUtils.TestRunErrorFormattableAdapter(
      result,
      {
        testRunPhase: resolvedTestController.testRun.phase,
        userAgent:
          resolvedTestController.testRun.browserConnection.browserInfo.userAgent
      }
    )
    return resolvedTestController.testRun.errs.push(errAdapter)
  })
}

const ifErrorTakeScreenshot = async resolvedTestController => {
  if (resolvedTestController.testRun.opts.screenshots.takeOnFails) {
    resolvedTestController.executionChain._state = 'fulfilled'
    return resolvedTestController.takeScreenshot().then(path => {
      return getAttachScreenshotToReport(path)
    })
  } else {
    return resolvedTestController.takeScreenshot()
  }
}
