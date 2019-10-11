import { Given, Then, When } from 'cucumber'
import book from '../book'
import HomePO from '../book/home.po'

const home: HomePO = book.getPage(HomePO.pageName) as any

Given('accept cookies', async () => {
  await home.assertCookies()
})

When('click {string} in horizontal menu', async menuOption => {
  await home.horizontalMenu(menuOption)
})

Then('tariffs are displayed', async () => {
  await home.mobileTariffDisplayed()
})
