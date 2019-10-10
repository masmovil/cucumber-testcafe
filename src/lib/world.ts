import { base64Sync } from 'base64-img'
import { setWorldConstructor } from 'cucumber'
import { testControllerHolder } from './test-controller-holder'

export interface TestControllerWithTestRun extends TestController {
  executionChain?: any
  testRun?: any
}

let testController: TestControllerWithTestRun = null

export function CustomWorld({ attach, parameters }) {
  this.waitForTestController = testControllerHolder
    .get()
    .then((tc: TestController) => {
      testController = tc
      return tc
    })

  this.attach = attach

  this.parameters = parameters

  this.attachScreenshotToReport = pathToScreenshot => {
    const imgInBase64 = base64Sync(pathToScreenshot)
    const imageConvertForCuc = imgInBase64.substring(
      imgInBase64.indexOf(',') + 1
    )
    return attach(imageConvertForCuc, 'image/png')
  }
}

setWorldConstructor(CustomWorld)

export { testController }
