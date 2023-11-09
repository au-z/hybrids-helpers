import { Descriptor, Property } from 'hybrids'

export const isClass = (fn) => typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn))

/**
 * Convert a Hybrids property to a Hybrids Descriptor
 * @param property a Hybrids property
 * @returns a Hybrids Descriptor
 */
export const propertyToDescriptor = <E, V>(property: Property<E, V>): Descriptor<E, V> => {
  return typeof property === 'function'
    ? { get: property }
    : typeof property === 'object'
    ? property
    : { value: property }
}
