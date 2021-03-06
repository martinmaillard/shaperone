import { createStore, ModelStore, StoreDispatch, StoreState, devtools } from '@captaincodeman/rdx'
import { editors } from '@hydrofoil/shaperone-core/models/editors'
import { createComponentsModel } from '@hydrofoil/shaperone-core/models/components'
import { forms } from '@hydrofoil/shaperone-core/models/forms'
import { TemplateResult } from 'lit-html'
import { renderer } from './renderer/model'

declare global {
  interface Window {
    Shaperone: {
      DEBUG: boolean
    }
  }
}

window.Shaperone = { DEBUG: false }

const config = {
  models: {
    editors,
    renderer,
    forms,
    components: createComponentsModel<TemplateResult>(),
  },
}

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>

export const store = (() => {
  const store = createStore(config)

  return () => {
    if (window.Shaperone?.DEBUG === true) {
      return devtools(store)
    }

    return store
  }
})()
