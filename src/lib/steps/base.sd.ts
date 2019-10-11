import { Given, Then, When } from 'cucumber'
import book from '../book'

const querystring = require('querystring')

Given('go to {string} url', async path => {
  await book.base.navigate({ path, qParams: {} })
})

Given('go to {string} url with queryparams {string}', async (path, params) => {
  await book.base.navigate({ path, qParams: querystring.parse(params) })
})

Given('go to {string} page', async pageName => {
  await book.getPage(pageName).navigate()
})

Given(
  'go to {string} page with queryparams {string}',
  async (pageName, params) => {
    await book
      .getPage(pageName)
      .navigate({ path: '/', qParams: querystring.parse(params) })
  }
)

When('{string} is present', async dataHook => {
  await book.base.isPresentByDataHook(dataHook)
})

When('{string} is not present', async dataHook => {
  await book.base.isNotPresentByDataHook(dataHook)
})

Then(`text {string} is present`, async textToSearch => {
  await book.base.isPresentText(textToSearch)
})

Then(`text {string} is present in {string}`, async (textToSearch, context) => {
  await book.base.isPresentText(textToSearch, context)
})

Then('clicks on {string} text', async text => {
  await book.base.clickByText(text)
})

Then('clicks on {string} selector', async selector => {
  await book.base.clickBySelector(selector)
})

Then('clicks on {string}', async dataHook => {
  await book.base.clickByDataHook(dataHook)
})

Then('field {string} field-name has text {string}', async (fieldName, text) => {
  await book.base.isFieldWithValue(fieldName, text)
})

Then(
  'complete {string} field-name with text {string}',
  async (fieldName, text) => {
    await book.base.setFieldValueByName(fieldName, text)
  }
)

Then(
  'complete {string} with attribute {string}={string} with text {string}',
  async (selector, attr, attrValue, text) => {
    await book.base.setFieldValueBySelector(selector, attr, attrValue, text)
  }
)

Then('tabulate to next form field', async () => {
  await book.base.pressTab()
})

Then('wait {int} ms', async time => {
  await book.base.waitDeterminateTime(time)
})

When('debug', async () => {
  await book.base.debug()
})
