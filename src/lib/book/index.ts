import BaseWithIdentifier from './baseWithElement.po'
export class Book {
  public pages = {} as { [key: string]: BaseWithIdentifier }
  public base: BaseWithIdentifier

  constructor () {
    this.base = new BaseWithIdentifier()
    this.pages.base = this.base 
  }
  addPage(pageName, identifier,pageObject) {
    this.pages[pageName] =  new BaseWithIdentifier(pageObject, identifier)
  }

  getPage(pageName) {
    if (this.pages[pageName]) {  
    return this.pages[pageName]
    }
    throw new Error(`Page does not exist, please check the book has ${pageName} page`)
  }
}

export default new Book()
