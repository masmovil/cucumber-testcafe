/**
 * Will get called once the browser instance gets available
 * see {@link testControllerHolder#register} and {@link testControllerHolder#capture}
 */
export interface TestControllerListener {
  onTestControllerSet(tc: TestController)
}

const testControllerHolder = {
  browser: null,
  captureResolver: null,
  getResolver: null,
  testControllerListener: null,
  lastTestController: null,
  baseURL: process.env.CUCUMBER_BASEURL,

  capture(t: TestController) {
    testControllerHolder.browser = t

    if (testControllerHolder.getResolver) {
      testControllerHolder.getResolver(t)
    }

    return new Promise(resolve => {
      testControllerHolder.captureResolver = resolve
    })
  },

  free() {
    testControllerHolder.lastTestController =
      testControllerHolder.browser
    testControllerHolder.browser = null

    if (testControllerHolder.captureResolver) {
      testControllerHolder.captureResolver()
    }
  },

  get(): Promise<TestController> {
    return new Promise(resolve => {
      if (testControllerHolder.browser) {
        resolve(testControllerHolder.browser)
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
