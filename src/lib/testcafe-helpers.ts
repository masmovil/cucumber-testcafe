import {
  Selector as SelectorBase,
  ClientFunction as ClientFunctionBase
} from 'testcafe'

import { browser } from './world'

export function Selector(selector, options = null) {
  return SelectorBase(selector, options).with({ boundTestRun: browser })
}

export function ClientFunction(fn) {
  return ClientFunctionBase(fn).with({
    boundTestRun: browser
  })
}
