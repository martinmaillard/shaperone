import { createModel } from '@captaincodeman/rdx'
import { EditorFactory } from '@hydrofoil/shaperone-wc/components'
import type { Renderer } from '@hydrofoil/shaperone-wc/renderer'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer'
import * as MaterialRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer'
import * as AccordionRenderStrategy from '@hydrofoil/shaperone-wc-vaadin/renderer/accordion'
import * as MaterialTabsRenderStrategy from '@hydrofoil/shaperone-wc-material/renderer/tabs'
import * as nestingComponents from '@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/components'
import * as nestingRenderer from '@hydrofoil/shaperone-playground-examples/NestedShapesIndividually/renderer'

export interface Menu {
  type?: 'layout' | 'renderer'
  text: string
  checked?: boolean
  children?: Menu[]
}

export interface NestedShapesState {
  components?: Record<string, EditorFactory>
  strategy: Renderer['strategy']
  menu: Menu
}

const layoutMenu: Menu = {
  text: 'Layout',
  children: [{
    text: 'No grouping',
    type: 'layout',
    checked: true,
  }, {
    text: 'Material tabs',
    type: 'layout',
  }, {
    text: 'Vaadin accordion',
    type: 'layout',
  }],
}

const nestingMenu: Menu = {
  text: 'Nested shapes',
  children: [{
    text: 'Disabled',
    checked: true,
    type: 'renderer',
  }, {
    text: 'Always one',
    type: 'renderer',
  }],
}

function updateMenu(menu: Menu, type: Menu['type'], text: string): Menu {
  let checked = menu.checked
  if (menu.type === type) {
    checked = menu.text === text
  }

  return {
    ...menu,
    checked,
    children: menu.children?.map(child => updateMenu(child, type, text)),
  }
}

const initialStrategy = { ...DefaultStrategy, ...MaterialRenderStrategy }

export const renderer = createModel({
  state: <NestedShapesState>{
    strategy: initialStrategy,
    menu: {
      text: 'Options',
      children: [layoutMenu, nestingMenu],
    },
  },
  reducers: {
    switchNesting(state, { name }: { name :string }) {
      let components: Record<string, EditorFactory> | undefined
      const strategy = {
        ...state.strategy,
        form: initialStrategy.form,
      }

      if (name === 'Always one') {
        components = nestingComponents
        strategy.form = nestingRenderer.topmostFocusNodeFormRenderer
      }

      return {
        ...state,
        strategy,
        components,
        menu: updateMenu(state.menu, 'renderer', name),
      }
    },
    switchLayout(state, { text }: Menu) {
      const strategy = {
        ...state.strategy,
        focusNode: initialStrategy.focusNode,
        group: initialStrategy.group,
      }

      if (text === 'Vaadin accordion') {
        strategy.group = AccordionRenderStrategy.AccordionGroupingRenderer
        strategy.focusNode = AccordionRenderStrategy.AccordionFocusNodeRenderer
      } else if (text === 'Material tabs') {
        strategy.group = MaterialTabsRenderStrategy.TabsGroupRenderer
        strategy.focusNode = MaterialTabsRenderStrategy.TabsFocusNodeRenderer
      }

      return {
        ...state,
        strategy,
        menu: updateMenu(state.menu, 'layout', text),
      }
    },
  },
})