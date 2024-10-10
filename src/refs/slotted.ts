import { mo } from '@auzmartist/hybrids-helpers'
import { Descriptor } from 'hybrids'

/**
 * Get a reference to a slotted light-DOM node
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
