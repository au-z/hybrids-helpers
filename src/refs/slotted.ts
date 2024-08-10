import { mo } from '@auzmartist/hybrids-helpers'
import { Descriptor } from 'hybrids'

/**
 * Get a reference to a slotted light-DOM node
 * @param name the slot name to select
 * @returns a hybrid descriptor binding a slotted node to the host
 */
export function slotted<E>(name?: string): Descriptor<E, Element | null> {
  return {
    value: (host: E & HTMLElement) => host.querySelector(name ? `*[slot="${name}"]` : '*:not([slot])'),
    connect: mo({ childList: true }),
  }
}
