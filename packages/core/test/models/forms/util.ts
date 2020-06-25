import deepmerge from 'deepmerge'
import { FocusNodeState, FormState, State } from '../../../models/forms/index'
import { ValueEditor } from '../../../models/editors/index'
import { FocusNode } from '../../../index'

type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    // eslint-disable-next-line @typescript-eslint/ban-types
    T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};

interface Initializer {
  valueEditors?: ValueEditor[]
  form?: Partial<FormState>
}

export function testState(form: unknown, initializer: Initializer = {}): State {
  const state = <State>{
    valueEditors: initializer.valueEditors || [],
    instances: new Map(),
  }

  state.instances.set(form, deepmerge<FormState>({
    shapes: [],
    focusStack: [],
    focusNodes: {},
  }, initializer.form || {}, { clone: false }))

  return state
}

export function testFocusNodeState(focusNode: FocusNode, initializer: Partial<FocusNodeState> = {}): FocusNodeState {
  return deepmerge<FocusNodeState>({
    focusNode,
    groups: [],
    properties: [],
  }, initializer, { clone: false })
}