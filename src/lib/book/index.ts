import BasePO from './base.po'

export class Book {
  public pages = {} as { [key: string]: BasePO }
  public base: BasePO

  constructor() {
    this.base = new BasePO()
    this.pages.base = this.base
  }

  addPage(pageName, pageObject) {
    this.pages[pageName] = pageObject
  }

  getPage(pageName) {
    if (this.pages[pageName]) {
      return this.pages[pageName]
    }
    return this.pages.base
  }
}

export default new Book()
