/**
 * Will get called once the TestController instance gets available
 * see {@link testControllerHolder#register} and {@link testControllerHolder#capture}
 */
export interface TestControllerListener {
  onTestControllerSet(tc: TestController)
}

const testControllerHolder = {
  testController: null,
  captureResolver: null,
  getResolver: null,
  testControllerListener: null,
  lastTestController: null,
  baseURL: process.env.CUCUMBER_BASEURL,

  capture(t: TestController) {
    testControllerHolder.testController = t

    if (testControllerHolder.getResolver) {
      testControllerHolder.getResolver(t)
    }

    return new Promise(resolve => {
      testControllerHolder.captureResolver = resolve
    })
  },

  free() {
    testControllerHolder.lastTestController =
      testControllerHolder.testController
    testControllerHolder.testController = null

    if (testControllerHolder.captureResolver) {
      testControllerHolder.captureResolver()
    }
  },

  get(): Promise<TestController> {
    return new Promise(resolve => {
      if (testControllerHolder.testController) {
        resolve(testControllerHolder.testController)
      } else {
        testControllerHolder.getResolver = resolve
      }
    })
  },

  register(testControllerListener: TestControllerListener): void {
    if (testControllerListener) {
      testControllerHolder.testControllerListener.push(testControllerListener)
    }
  }
}

export { testControllerHolder }
