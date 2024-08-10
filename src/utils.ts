import { Component, Descriptor, Property } from 'hybrids'
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type Mixin<T> = Optional<Component<T>, 'tag'>
export type Invalidate<E, K extends keyof E> = Parameters<Descriptor<E, E[K]>['connect']>[2]

export const isClass = (fn) => typeof fn === 'function' && /^class\s/.test(Function.prototype.toString.call(fn))

/**
 * Convert a Hybrids property to a Hybrids Descriptor
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
