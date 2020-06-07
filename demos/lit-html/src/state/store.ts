import { createStore, devtools, ModelStore, StoreDispatch, StoreState } from '@captaincodeman/rdx'
import { config } from './config'

export const store = devtools(createStore(config))

export type State = StoreState<typeof config>
export type Dispatch = StoreDispatch<typeof config>
export type Store = ModelStore<Dispatch, State>