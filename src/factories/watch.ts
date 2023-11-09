import { Descriptor, Property } from 'hybrids'
import { propertyToDescriptor } from 'src/utils'

/**
 * Wrap a Property with a custom observer. If an 'observe' Descriptor property is already defined, observe will be run after.
 * @param defaultValue the default property value
 */
export const watch = <E, V = any>(property: Property<E, V>, observe?: Descriptor<E, V>['observe']): Property<E, V> => {
  const descriptor = propertyToDescriptor(property)
  return {
    ...descriptor,
    observe: (host, val, last) => {
      descriptor.observe?.(host, val, last)
      observe?.(host, val, last)
    },
  }
}
