import { Descriptor } from 'hybrids'

/**
 * @deprecated use 'value' instead
 * Create a readable/writable property without attribute reflection. Can be helpful for managing exposed attributes or creating properties with complex data types.
 * ```
 * define({
 *   array: getset([]),
 * })
 * ```
 * @category Factories
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param defaultValue the default value
 * @returns a Hybrids Descriptor
 * @see https://hybrids.js.org/#/component-model/structure?id=get-amp-set
 */
export const getset = <E, V = any>(value: V = undefined): Descriptor<E, V> => ({
  value,
})
