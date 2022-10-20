import { Descriptor } from "hybrids"
import { Store } from "redux"

/**
 * Select an portion of a Redux store
 * @param store the store to reactively get a value from
 * @param getter a function selecting something from the store
 * @param connect an optional 'connect' Descriptor function
 * @param observe an optional 'observe' Descriptor function
 * @returns a Descriptor getting a piece of the store
 */
export function redux<E, V, S>(
  store: Store<S>,
  getter: (host: E, state: S) => V,
  connect?: Descriptor<E, V>['connect'],
  observe?: Descriptor<E, V>['observe']
): Descriptor<E, V> {
  const get = (host) => (getter ? getter(host, store.getState()) : <V>(<unknown>store.getState()))

  return {
    get,
    connect: (host, key, invalidate) => {
      store.subscribe(() => {
        if (host[key] !== get(host)) invalidate()
      })
      return connect && connect(host, key, invalidate)
    },
    observe,
  }
}