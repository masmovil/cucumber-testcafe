import { BasePO } from 'cucumber-testcafe'
import { testController } from 'cucumber-testcafe/dist/lib/world'

export default class HomePO extends BasePO {
  static pageName: 'home'

  async assertCookies() {
    const cookies = await this.select('div[class*="cookies close"]')

    if (cookies.exists) {
      await testController.click(cookies)
    }
  }

  tariffList() {
    return this.select('.desktop [data-hook="tariffs-card-details"]')
  }

  async horizontalMenu(menuOption) {
    switch (menuOption) {
      case 'fibra+movil':
        return testController.click(
          this.selectByDataHook('link-home-menu-convergent')
        )
        break

      case 'tarifas movil':
        return testController.click(
          this.selectByDataHook('link-home-menu-mobileonly')
        )
        break

      case 'móviles y más':
        return testController.click(
          this.selectByDataHook('link-home-menu-terminals')
        )
        break

      case 'sólo fibra':
        return testController.click(
          this.selectByDataHook('link-home-menu-fixed')
        )
        break

      case 'tv a lo yoigo':
        return testController.click(this.selectByDataHook('link-home-menu-tv'))
        break
      default:
        return testController
          .expect(true)
          .eql(false, `Case ${menuOption} not recognized`)
        break
    }
  }

  async mobileTariffDisplayed() {
    return testController
      .expect(this.tariffList().visible)
      .ok('tariffs are not displayed or visible')
  }
}
