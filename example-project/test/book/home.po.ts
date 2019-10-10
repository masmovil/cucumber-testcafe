import { BasePO } from 'cucumber-testcafe'
import { testController } from 'cucumber-testcafe/dist/lib/world'

export default class HomePO extends BasePO {
  async assertCookies() {
    const cookies = await this.select('div[class*="cookies close"]')

    if (cookies.exists) {
      await testController.click(cookies)
    }
  }
  // data-hooks
  tariffList = () =>
    this.selectByXpath(
      "//div[contains(@class, 'desktop')]//div[contains(@data-hook, 'tariffs-card-details')]"
    )

  async horizontalMenu(menuOption) {
    switch (menuOption) {
      case 'fibra+movil':
        await testController.click(
          this.selectByDataHook('link-home-menu-convergent')
        )
        break

      case 'tarifas movil':
        await testController.click(
          this.selectByDataHook('link-home-menu-mobileonly')
        )
        break

      case 'móviles y más':
        await testController.click(
          this.selectByDataHook('link-home-menu-terminals')
        )
        break

      case 'sólo fibra':
        await testController.click(
          this.selectByDataHook('link-home-menu-fixed')
        )
        break

      case 'tv a lo yoigo':
        await testController.click(this.selectByDataHook('link-home-menu-tv'))
        break
      default:
        await testController
          .expect(true)
          .eql(false, `Case ${menuOption} not recognized`)
        break
    }
  }

  async mobileTariffDisplayed() {
    await testController
      .expect(this.tariffList().visible)
      .ok('tariffs are not displayed or visible')
  }
}
