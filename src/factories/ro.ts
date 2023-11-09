import { Descriptor, Property } from 'hybrids'
import { propertyToDescriptor } from 'src/utils'

/**
 * Wrap a Property with a resize observer which will invalidate on resize.
 * @param prop any Hybrids property or descriptor
 * @returns a descriptor which will invalidate on resize
 */
export function ro<V = any, E extends HTMLElement = HTMLElement>(prop: Property<E, V>): Descriptor<E, V> {
  const descriptor = propertyToDescriptor(prop)
  const connect = (host, key, invalidate) => {
    const disconnect = descriptor.connect?.(host, key, invalidate)
    const ro = new ResizeObserver(() => {
      invalidate()
    })
    ro.observe(host)
    return () => {
      ro.disconnect()
      disconnect && disconnect()
    }
  }
  return {
    ...descriptor,
    connect,
  }
}
