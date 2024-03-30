import { Descriptor, Property, define } from 'hybrids'
import { propertyToDescriptor } from 'src/utils'

/**
 * Reflect a property without a value to an attribute on the host.
 * ```
 * define({
 *   num: 0,
 *   positive: reflect(({num}) => num > 0),
 * })
 * ```
 * @category Descriptors
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param prop the property to reflect
 * @param name the attribute name to reflect to (defaults to the property key)
 * @returns a Hybrids Descriptor with the reflection side-effect
 */
export const reflect = <E extends HTMLElement, V>(prop: Property<E, V>, name?: string): Descriptor<E, V> => {
  const descriptor = propertyToDescriptor<E, V>(prop)
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
