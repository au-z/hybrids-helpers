import { Component, Descriptor, Property } from 'hybrids'
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Mixin<T> = Optional<Component<T>, 'tag'>
export type Invalidate<E, K extends keyof E> = Parameters<Descriptor<E, E[K]>['connect']>[2]

/**
 * Check if a function is a class.
 * @category Utils
 * @param fn a function
 * @returns true if the function is a class
 */
export const isClass = (fn) => typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn))

/**
 * Convert a Hybrids property to a Hybrids Descriptor
 * @category Utils
 * @param property a Hybrids property
 * @returns a Hybrids Descriptor
 */
export const propertyToDescriptor = <E, V>(property: Property<E, V>): Descriptor<E, V> => {
  return typeof property === 'function'
    ? { value: property }
    : typeof property === 'object'
    ? property
    : { value: property }
}
