import { book } from 'cucumber-testcafe'
import HomePO from './home.po'
import TodoMVCPO from './todomvc.po'

book.addPage(HomePO.pageName, new HomePO())
book.addPage(TodoMVCPO.pageName, new TodoMVCPO())

export default book
