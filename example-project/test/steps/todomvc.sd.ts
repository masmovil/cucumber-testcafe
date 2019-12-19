import { Given } from 'cucumber'
import book from '../book'
import TodoMVCPO from '../book/todomvc.po'

const todo: TodoMVCPO = book.getPage(TodoMVCPO.pageName) as any

Given('add task {string}', async task => {
  await todo.addItem(task)
})

Given('todo list is empty', async () => {
  await todo.isEmpty()
})

Given('todo list is not empty', async () => {
  await todo.hasItems()
})
