/* global window */
/* eslint-disable class-methods-use-this */
// TODO: remove xpath-to-css selector
import { xPathToCss } from '../xpath-to-css'
import { testControllerHolder } from '../test-controller-holder'
import { testController } from '../world'
import { Selector, ClientFunction } from '../testcafe-helpers'

const querystring = require('querystring')

interface NavigateParams {
  baseURL?: string
  path?: string
  qParams?: {
    [key: string]: string
  }
}
export default class BasePO {
  navigate(
    params: NavigateParams = {
      baseURL: testControllerHolder.baseURL,
      path: '/',
      qParams: {}
    }
  ) {
    const url = `${
      params.baseURL === undefined
        ? testControllerHolder.baseURL
        : params.baseURL
    }${params.path}?${querystring.stringify(params.qParams)}`

    return testController.navigateTo(url)
  }

  goBack() {
    // TODO: ClientFunction as factory with testcontroller binded
    return ClientFunction(() => window.history.back())()
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
    return ClientFunction((xnum, ynum) => window.scrollBy(xnum, ynum))(x, y)
  }

  getUrl() {
    return ClientFunction(() => window.location.href)() as Promise<string>
  }

  async setResolutionSize(val1, val2) {
    await testController.resizeWindow(val1, val2)
    return testController.wait(500)
  }

  async refreshPage() {
    const url = await this.getUrl()
    return testController.navigateTo(url)
  }

  isPresentText(text, dataHookContext?) {
    const properties = ['a', 'p', 'div', 'li', 'span', 'h1', 'h2', 'h3', 'h4']

    return dataHookContext
      ? testController
          .expect(
            this.selectByDataHook(dataHookContext)
              .find(properties.join(','))
              .withText(text).exists
          )
          .ok()
      : testController
          .expect(this.select(properties.join(',')).withText(text).exists)
          .ok()
  }

  isPresentByDataHook(dataHook) {
    return testController.expect(this.selectByDataHook(dataHook).exists).ok()
  }

  isNotPresentByDataHook(dataHook) {
    return testController.expect(this.selectByDataHook(dataHook).exists).notOk()
  }

  isPresentBySelector(selector) {
    return testController.expect(this.select(selector).exists).ok()
  }

  isNotPresentBySelector(selector) {
    return testController.expect(this.select(selector).exists).notOk()
  }

  clickByDataHook(dataHook) {
    return testController.click(this.selectByDataHook(dataHook))
  }

  clickBySelector(selector, index = 0) {
    return testController.click(this.select(selector).nth(index))
  }

  clickByText(text) {
    return testController.click(
      this.select('a, p, li, span, button, em').withText(text)
    )
  }

  clickByNameValue(type, name, value) {
    return testController.click(
      this.select(`[type=${type}][name=${name}][value="${value}"]`)
    )
  }

  clickByNameIndex(type, name, index) {
    return testController.click(
      this.select(`[type=${type}][name=${name}]`).nth(index)
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

  setFieldValueBySelector(selector, attributeName, attribute, text) {
    return testController.typeText(
      this.select(selector).withAttribute(attributeName, attribute),
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
