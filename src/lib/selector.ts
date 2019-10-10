import { testController } from './world'
import { Selector as SelectorBase } from 'testcafe'

export function Selector(selector) {
  return SelectorBase(selector).with({ boundTestRun: testController })
}
