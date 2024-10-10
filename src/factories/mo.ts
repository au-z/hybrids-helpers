import { Descriptor, Property } from 'hybrids'
import { propertyToDescriptor } from '../utils.js'

export interface HostedMutationCallback<E extends HTMLElement = HTMLElement> {
  (host: E, mutations: MutationRecord[], observer: MutationObserver): void
}

/**
 * Wrap a Property with a mutation observer which will invalidate on mutation.
 * @param prop any Hybrids property
 * @param init the mutation observer init options
 * @returns a dscriptor which will invalidate on mutation
 */
export function mo<V = any, E extends HTMLElement = HTMLElement>(
  prop: Property<E, V>,
  init: MutationObserverInit & {
    callback?: HostedMutationCallback<E>
  }
): Descriptor<E, V> {
  const descriptor = propertyToDescriptor(prop)
  const connect = (host, key, invalidate) => {
    const disconnect = descriptor.connect?.(host, key, invalidate)
    const mo = new MutationObserver((mutations, observer) => {
      invalidate()
      init?.callback?.(host, mutations, observer)
    })
    mo.observe(host, init)
    return () => {
      mo.disconnect()
      disconnect && disconnect()
    }
  }
  return {
    ...descriptor,
    connect,
  }
}
