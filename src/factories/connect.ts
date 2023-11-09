import { Descriptor } from 'hybrids'

/**
 * Shorthand factory for a blank value with connector.
 * @param connect connect function
 * @returns A Descriptor with only a connect function
 */
export function connect<E, V = undefined>(connect: Descriptor<E, V>['connect']): Descriptor<E, V> {
  return {
    value: undefined,
    connect,
  }
}
