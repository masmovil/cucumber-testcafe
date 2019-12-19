import { BasePO } from 'cucumber-testcafe'
import { testController } from 'cucumber-testcafe/dist/lib/world'

export default class TodoMVCPO extends BasePO {
  static pageName = 'todomvc'

  async addItem(task) {
    return this.setFieldValueBySelector('.new-todo', task).pressKey('enter')
  }

  async hasItems() {
    return testController.expect(this.select('.destroy').exists).ok()
  }

  async isEmpty() {
    return testController.expect(this.select('.destroy').exists).notOk()
  }
}
