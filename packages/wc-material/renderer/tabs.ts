import type { FocusNodeRenderStrategy, GroupRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'
import { html } from '@hydrofoil/shaperone-wc'
import { repeat } from 'lit-html/directives/repeat'
import { styleMap } from 'lit-html/directives/style-map'
import { PropertyGroupState } from '@hydrofoil/shaperone-core/models/forms'

export const TabsFocusNodeRenderer: FocusNodeRenderStrategy = ({ focusNode, actions, renderGroup }) => {
  function renderTab(group: PropertyGroupState) {
    const header = group.group?.label || 'Ungrouped properties'

    return html`<mwc-tab label="${header}" @MDCTab:interacted="${() => actions.selectGroup(group.group)}"></mwc-tab>`
  }

  return html`
    <mwc-tab-bar .activeIndex="${focusNode.groups.findIndex(g => g.selected)}">
        ${repeat(focusNode.groups, renderTab)}
    </mwc-tab-bar>
    ${repeat(focusNode.groups, renderGroup)}`
}

TabsFocusNodeRenderer.loadDependencies = () => [
  import('@material/mwc-tab-bar/mwc-tab-bar'),
  import('@material/mwc-tab/mwc-tab'),
]

export const TabsGroupRenderer: GroupRenderStrategy = ({ group, properties, renderProperty }) => {
  const styles = {
    display: group.selected ? 'block' : 'none',
  }

  return html`<div style="${styleMap(styles)}">
    <div part="property-group">
      ${repeat(properties, renderProperty)}
    </div>
  </div>`
}
