import { Descriptor } from 'hybrids'

/**
 * Set a one-time writeable property.
 * ```
 * define({
 *   attr: set(''),
 *   capsAttr: set('', (host, set) => set.toUpperCase()),
 * })
 * ```
 * @category Descriptors
 * @param defaultValue the default attribute value
 * @param setter a hook into the setter
 * @returns a Descriptor
 * @see https://hybrids.js.org/#/component-model/structure?id=get-amp-set
 */
export const set = <E, V = any>(setter: Descriptor<E, V>['set']): Descriptor<E, V> => ({
  set: (host, val = setter(host, undefined, undefined), last) => setter(host, val, last),
})
