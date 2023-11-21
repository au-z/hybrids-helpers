import { Descriptor, Property } from 'hybrids'
import { propertyToDescriptor } from 'src/utils'

/**
 * Run one or more watchers when the property changes
 * @param property any Hybrids property
 * @param observes one or more observe functions to execute when the property value changes
 * @returns the resulting Hybrids property
 * @deprecated please use effect() released in 0.4.0
 */
export const watch = <E, V = any>(
  property: Property<E, V>,
  ...observes: Descriptor<E, V>['observe'][]
): Property<E, V> => {
  const descriptor = propertyToDescriptor(property)
  return {
    ...descriptor,
    observe: (host, val, last) => {
      descriptor.observe?.(host, val, last)
      observes.forEach((observe) => observe(host, val, last))
    },
  }
}

/**
 * Run one or more effects when the property changes
 * @param property any Hybrids property
 * @param observes one or more observe functions to execute when the property value changes
 * @returns the resulting Hybrids property
 */
export const effect = <E, V = any>(
  property: Property<E, V>,
  ...observes: Descriptor<E, V>['observe'][]
): Property<E, V> => {
  const descriptor = propertyToDescriptor(property)
  return {
    ...descriptor,
    observe: (host, val, last) => {
      descriptor.observe?.(host, val, last)
      observes.forEach((observe) => observe(host, val, last))
    },
  }
}
