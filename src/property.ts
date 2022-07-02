import { Descriptor, Property } from "hybrids"

/**
 * @deprecated Preferred method of 
 * https://hybrids.js.org/#/migration?id=property-factory
 */
export const property = <E, V>(
  value: V,
  connect?: Descriptor<E, V>['connect'],
  observe?: Descriptor<E, V>['observe']
): Property<E, V> => {
  return { value, connect, observe }
}