import { Descriptor } from 'hybrids'

/**
 * Protects a property from outside access
 * Can be used to develop more restrictive component APIs
 * @param property a normal Hybrids property to protect
 * @returns the protected property
 * @since TBD
 */
export const protect = <E, V>(getset: Omit<Descriptor<E, V>, 'connect' | 'observe'>): Descriptor<E, V> => {
  const { get, set } = getset
  let proxy: { value: V }

  return {
    get: () => proxy.value,
    set: (_, val) => {
      proxy.value = val
      return val
    },

    // TODO
    connect(host, key, invalidate) {
      // proxy = new Proxy(
      //   { value: get(host) },
      //   {
      //     get(obj, p) {
      //       if (p !== 'value') return
      //       return get(host, obj[p])
      //     },
      //     set(obj, p, newValue) {
      //       if (p !== 'value') return Reflect.set(obj, p, newValue)
      //       // perform setter logic
      //       try {
      //         obj[p] = set(host, newValue, obj[p])
      //         invalidate()
      //         return true
      //       } catch {
      //         return false
      //       }
      //     },
      //   }
      // )
    },
  }
}
