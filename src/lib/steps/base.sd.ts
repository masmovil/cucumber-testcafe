import { Given } from 'cucumber'
import book from '../book'

const querystring = require('querystring')

Given('go to {string} page', async pageName => {
  await book.getPage(pageName).navigate()
})

Given('go to {string} url', async path => {
  await book.base.navigate({ path, qParams: {} })
})

Given('go to {string} url with queryparams {string}', async (path, params) => {
  await book.base.navigate({ path, qParams: querystring.parse(params) })
})

Given(
  'go to {string} page with queryparams {string}',
  async (pageName, params) => {
    await book
      .getPage(pageName)
      .navigate({ path: '/', qParams: querystring.parse(params) })
  }
)

Given('{string} is present', async dataHook => {
  await book.base.isPresentByDataHook(dataHook)
})

Given('{string} is not present', async dataHook => {
  await book.base.isNotPresentByDataHook(dataHook)
})

Given(`text {string} is present`, async textToSearch => {
  await book.base.isPresentText(textToSearch)
})

Given(`text {string} is present in {string}`, async (textToSearch, context) => {
  await book.base.isPresentText(textToSearch, context)
})

Given('clicks on {string} text', async text => {
  await book.base.clickByText(text)
})

Given('clicks on {string} selector', async selector => {
  await book.base.clickBySelector(selector)
})

Given('clicks on {string}', async dataHook => {
  await book.base.clickByDataHook(dataHook)
})

Given(
  'field {string} field-name has value {string}',
  async (fieldName, value) => {
    await book.base.isFieldWithValue(fieldName, value)
  }
)

Given(
  'complete {string} field-name with value {string}',
  async (fieldName, value) => {
    await book.base.setFieldValueByName(fieldName, value)
  }
)

Given(
  'complete {string} with attribute {string}={string} with value {string}',
  async (selector, attr, attrValue, value) => {
    await book.base.setFieldValueBySelector(selector, attr, attrValue, value)
  }
)

Given('tabulate to next form field', async () => {
  await book.base.pressTab()
})

Given('wait {int} ms', async time => {
  await book.base.waitDeterminateTime(time)
})

Given('debug', async () => {
  await book.base.debug()
})
