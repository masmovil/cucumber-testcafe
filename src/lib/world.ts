import { base64Sync } from 'base64-img'
import { setWorldConstructor } from 'cucumber'
import { testControllerHolder } from './test-controller-holder'

let {RPWorld}  = require('@reportportal/agent-js-cucumber')
export interface TestControllerWithTestRun extends TestController {
  executionChain?: any
  testRun?: any
}
let browser: TestControllerWithTestRun = null
class CustomWorld{

 attach: any
 parameters: any

constructor(attach,parameters){
this.attach = attach
this.parameters = parameters


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
  return this.attach(imageConvertForCuc, 'image/png')
}
}



// export function CustomWorld2({ attach, parameters }) {
//   this.waitForTestController = testControllerHolder
//     .get()
//     .then((tc: TestController) => {
//       testController = tc
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
