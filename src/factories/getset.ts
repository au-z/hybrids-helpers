import { Descriptor } from 'hybrids'

/**
 * Create a readable/writable property without attribute reflection. Can be helpful for managing exposed attributes or creating properties with complex data types.
 * ```
 * define({
 *   array: getset([]),
 * })
 * ```
 * @category Descriptors
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param defaultValue the default value
 * @returns a Hybrids Descriptor
 * @see https://hybrids.js.org/#/component-model/structure?id=get-amp-set
 */
export const getset = <E, V = any>(defaultValue: V = undefined): Descriptor<E, V> => ({
  get: (host, val = defaultValue) => val,
  set: (host, val) => val,
})
