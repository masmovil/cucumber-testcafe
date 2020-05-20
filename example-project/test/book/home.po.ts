import { BasePO } from 'cucumber-testcafe'
import { testController } from 'cucumber-testcafe/dist/lib/world'

export default class HomePO extends BasePO {
  static pageName = 'home'

  async assertCookies() {
    const cookies = await this.select('.thor-cookies-popup__button')

    if (cookies.exists) {
      await testController.click(cookies)
    }
    return Promise.resolve()
  }

  tariffList() {
    return this.select('.tariff-cards__wrapper')
  }

  async horizontalMenu(menuOption) {
    switch (menuOption) {
      case 'fibra+movil':
        return testController.click(
          this.selectByDataHook('link-home-menu-convergent')
        )

      case 'tarifas movil':
        return testController.click(
          this.selectByDataHook('link-home-menu-mobileonly')
        )

      case 'móviles y más':
        return testController.click(
          this.selectByDataHook('link-home-menu-terminals')
        )

      case 'sólo fibra':
        return testController.click(
          this.selectByDataHook('link-home-menu-fixed')
        )

      case 'tv a lo yoigo':
        return testController.click(this.selectByDataHook('link-home-menu-tv'))
      default:
        return testController
          .expect(true)
          .eql(false, `Case ${menuOption} not recognized`)
    }
  }

  async mobileTariffDisplayed() {
    return testController
      .expect(this.tariffList().visible)
      .ok('tariffs are not displayed or visible')
  }
}
