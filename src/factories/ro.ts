import { Descriptor, Property } from 'hybrids'
import { propertyToDescriptor } from '@src/utils.js'

/**
 * Wrap a Property with a resize observer which will invalidate on resize.
 * @category Factories
 * @param prop any Hybrids property
 * @param options the resize observer options
 * @returns a descriptor which will invalidate on resize
 */
export function ro<V = any, E extends HTMLElement = HTMLElement>(
  prop: Property<E, V>,
  options?: ResizeObserverOptions
): Descriptor<E, V> {
  const descriptor = propertyToDescriptor(prop)
  const connect = (host, key, invalidate) => {
    const disconnect = descriptor.connect?.(host, key, invalidate)
    const ro = new ResizeObserver(() => {
      invalidate()
    })
    ro.observe(host, options)
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
