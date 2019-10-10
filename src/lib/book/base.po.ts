/* global window */
/* eslint-disable class-methods-use-this */
import { ClientFunction } from 'testcafe'
import { objectToQueryString } from '../query-params'
// TODO: remove xpath-to-css selector
import { xPathToCss } from '../xpath-to-css'
import { testControllerHolder } from '../test-controller-holder'
import { testController } from '../world'
import { Selector } from '../selector'

export default class BasePO {
  // TODO: refactor after thor-base navigate changes
  navigate(
    params: { path: string; qParams: object } = {
      path: '/',
      qParams: {}
    }
  ) {
    const url = `${testControllerHolder.baseURL}${
      params.path
    }?${objectToQueryString(params.qParams)}`

    return testController.navigateTo(url)
  }

  goBack() {
    // TODO: ClientFunction as factory with testcontroller binded
    return ClientFunction(() => window.history.back()).with({
      boundTestRun: testController
    })()
  }

  select(selector) {
    return Selector(selector)
  }

  // TODO: remove this function
  selectByXpath(xpath) {
    return Selector(xPathToCss(xpath))
  }

  selectByDataHook(selector) {
    return Selector(`[data-hook="${selector}"]`)
  }

  selectByDataHooks(selectors) {
    return Selector(
      selectors.map(selector => `[data-hook="${selector}"]`).join(' ')
    )
  }

  selectByStartWithDataHook(selector) {
    return Selector(`[data-hook^="${selector}"]`)
  }

  scroll(x, y) {
    return ClientFunction((xnum, ynum) => window.scrollBy(xnum, ynum)).with({
      boundTestRun: testController
    })(x, y)
  }

  getUrl() {
    return ClientFunction(() => window.location.href).with({
      boundTestRun: testController
    })()
  }

  async setResolutionSize(val1, val2) {
    await testController.resizeWindow(val1, val2)
    return testController.wait(500)
  }

  async refreshPage() {
    const url = await this.getUrl()
    return testController.navigateTo(url)
  }

  isPresentText(text, context?) {
    const properties = ['a', 'p', 'div', 'li', 'span', 'h1', 'h2', 'h3', 'h4']
    const propertiesWithContext = properties.map(
      property => `(//*[@data-hook="${context}"]//${property})`
    )

    return context
      ? testController
          .expect(
            this.selectByXpath(propertiesWithContext.join('|')).withText(text)
              .exists
          )
          .ok()
      : testController
          .expect(
            this.selectByXpath(properties.join('|')).withText(text).exists
          )
          .ok()
  }

  isPresentByDataHook(dataHook) {
    return testController.expect(this.selectByDataHook(dataHook).exists).ok()
  }

  isNotPresentByDataHook(dataHook) {
    return testController.expect(this.selectByDataHook(dataHook).exists).notOk()
  }

  clickByDataHook(dataHook) {
    return testController.click(this.selectByDataHook(dataHook))
  }

  clickByTag(tag, index = 0) {
    return testController.click(this.select(`${tag}`).nth(index))
  }

  clickByText(text) {
    return testController.click(
      this.select('a, p, li, span, button, em').withText(text)
    )
  }

  async isFieldWithValue(fieldName, value) {
    return testController
      .expect(await this.select(`input[name*="${fieldName}"]`).value)
      .eql(value)
  }

  setFieldValueByName(fieldName, text) {
    return testController.typeText(
      this.select(`input[name*="${fieldName}"]`),
      text,
      {
        replace: true
      }
    )
  }

  pressTab() {
    return testController.pressKey('tab')
  }

  waitDeterminateTime(time = 500) {
    return testController.wait(time)
  }

  debug() {
    return testController.debug()
  }
}
