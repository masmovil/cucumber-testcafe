import { book } from 'cucumber-testcafe'
import HomePO from './home.po'

book.addPage(HomePO.pageName, new HomePO())

export default book
