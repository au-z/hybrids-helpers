import { mo } from '@auzmartist/hybrids-helpers'
import { Descriptor } from 'hybrids'

/**
 * Get a reference to a slotted light-DOM node
 * ```
 * define({
 *   tag: 'my-component',
 *   content: slotted(),
 *   named: slotted('named-slot'),
 *   render: () => html`
 *     <slot></slot>
 *     <slot name="named-slot"></slot>
 *   `
 * })
 *
 * <my-component>
 *   <div>Default slot</div>
 *   <div slot="named-slot">Named slot</div>
 * </my-component>
 * ```
 * @category Ref
 * @param name the slot name to select. If not provided, selects the default slotted nodes.
 * @returns a hybrid descriptor binding a slotted node to the host
 */
export function slotted(name?: string): Descriptor<unknown, Element | null> {
  return mo(
    {
      value: (host: HTMLElement) => host.querySelector(name ? `*[slot="${name}"]` : '*:not([slot])'),
    },
    { childList: true }
  )
}
