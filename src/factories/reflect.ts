import { Property } from 'hybrids'
import { propertyToDescriptor } from '../utils.js'

/**
 * Reflect any property to an attribute on the host
 * @param prop the property to reflect
 * @param bidirectional if true, sets the property when the attribute changes
 * @returns a Hybrids Descriptor with the reflection side-effect
 */
export const reflect = <E extends HTMLElement, V>(prop: Property<E, V>, bidirectional = false) => {
  const descriptor = propertyToDescriptor(prop)
  const computed = typeof descriptor.value === 'function'
  return {
    ...descriptor,
    reflect: true,
    connect(host, key, invalidate) {
      const disconnect = descriptor.connect?.(host, key, invalidate)

      let ob
      if (bidirectional) {
        ob = new MutationObserver(() => {
          if (!computed) host[key] = host.getAttribute(key)
        })
        ob.observe(host, { attributes: true, attributeFilter: [key] })
      }

      return () => {
        if (ob?.disconnect) ob.disconnect()
        if (disconnect) disconnect()
      }
    },
  }
}
