import { Property } from 'hybrids'
import { propertyToDescriptor } from '../utils.js'

/**
 * Reflect any property to an attribute on the host
 * @param prop the property to reflect
 * @param name the attribute name to reflect to (defaults to the property key)
 * @returns a Hybrids Descriptor with the reflection side-effect
 */
export const reflect = <E extends HTMLElement, V>(prop: Property<E, V>, name?: string) => {
  const descriptor = propertyToDescriptor(prop)
  return {
    ...descriptor,
    connect: (host, key, invalidate) => {
      if (!name) name = key
      return descriptor.connect?.(host, key, invalidate)
    },
    observe: (host, val, last) => {
      if (val) {
        const value = typeof val === 'boolean' ? '' : JSON.stringify(val)
        host.setAttribute(name, value)
      } else {
        host.removeAttribute(name)
      }
      descriptor.observe?.(host, val, last)
    },
  }
}
