import {
  Selector as SelectorBase,
  ClientFunction as ClientFunctionBase
} from 'testcafe'

import { testController } from './world'

export function Selector(selector, options = null) {
  return SelectorBase(selector, options).with({ boundTestRun: testController })
}

export function ClientFunction(fn) {
  return ClientFunctionBase(fn).with({
    boundTestRun: testController
  })
}
