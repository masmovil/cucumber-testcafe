import { base64Sync } from 'base64-img'
import { setWorldConstructor } from 'cucumber'
import { testControllerHolder } from './test-controller-holder'
import { RPWorld } from '@reportportal/agent-js-cucumber'
export interface TestControllerWithTestRun extends TestController {
  executionChain?: any
  testRun?: any
}

let browser: TestControllerWithTestRun = null


export class CustomWorld extends RPWorld{
constructor ({ attach, parameters }){
super(attach,parameters)

}
waitForTestController = testControllerHolder
    .get()
    .then((tc: TestController) => {
      browser = tc
      return tc
    })

attachScreenshotToReport = pathToScreenshot => {
    const imgInBase64 = base64Sync(pathToScreenshot)
    const imageConvertForCuc = imgInBase64.substring(
      imgInBase64.indexOf(',') + 1
    )
    return super.attach(imageConvertForCuc, 'image/png')
  }
}


// export function CustomWorld({ attach, parameters }) {
//   this.waitForTestController = testControllerHolder
//     .get()
//     .then((tc: TestController) => {
//       browser = tc
//       return tc
//     })

//   this.attach = attach

//   this.parameters = parameters

//   this.attachScreenshotToReport = pathToScreenshot => {
//     const imgInBase64 = base64Sync(pathToScreenshot)
//     const imageConvertForCuc = imgInBase64.substring(
//       imgInBase64.indexOf(',') + 1
//     )
//     return attach(imageConvertForCuc, 'image/png')
//   }
// }

setWorldConstructor(CustomWorld)

export { browser }
