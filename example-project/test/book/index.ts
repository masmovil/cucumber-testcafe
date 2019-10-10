import { book } from 'cucumber-testcafe'
import HomePO from './home.po'

book.addPage('home', new HomePO())

export default book
