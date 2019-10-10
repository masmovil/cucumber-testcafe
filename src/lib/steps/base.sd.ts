import { Given, Then, When } from 'cucumber'
import book from '../book'

Given('go to {string} url', async path => {
  await book.base.navigate({ path, qParams: {} })
})

Given('go to {string} page', async pageName => {
  await book.getPage(pageName).navigate()
})

When('{string} is present', async dataHook => {
  await book.base.isPresentByDataHook(dataHook)
})

Then('tabulate to next form field', async () => {
  await book.base.pressTab()
})

Then('wait {int} ms', async time => {
  await book.base.waitDeterminateTime(time)
})

Then(`text {string} is present`, async textToSearch => {
  await book.base.isPresentText(textToSearch)
})

Then(`text {string} is present in {string}`, async (textToSearch, context) => {
  await book.base.isPresentText(textToSearch, context)
})

When('debug', async () => {
  await book.base.debug()
})
