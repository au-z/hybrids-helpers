import { Descriptor } from 'hybrids'

/**
 * Listen to a map of events. Handles listener registration and deregistration.
 * ```
 * define<any>({
 *   foo: 0,
 *   incrementFoo: (host) => (e) => host.foo++,
 *   _connect: {
 *     value: undefined,
 *     connect: listen((host: any, key, invalidate) => ({
 *      'foo': host.incrementFoo,
 *      'click': invalidate,
 *   }
 * })
 * ```
 * @category Connectors
 * @typeParam E - host element type
 * @param eventMapFn a connect function returning a record of events and bound functions to listen to
 * @param element optional element to bind the listeners to
 * @returns A Descriptor['connect'] function
 */
export function listen<E>(
  eventMapFn: (
    host: E,
    key: '__property_key__',
    invalidate: (options?: { force?: boolean }) => void
  ) => Record<string, (e: Event) => void>,
  element?: Element
): NonNullable<Descriptor<E, any>['connect']> {
  return (host: E & HTMLElement, key: '__property_key__', invalidate: (options?: { force?: boolean }) => void) => {
    const eventMap = eventMapFn(host, key, invalidate)
    const target = element ?? host
    Object.entries(eventMap).forEach(([event, callback]) => {
      target.addEventListener(event, (e) => callback(e))
    })
    return () => {
      Object.entries(eventMap).forEach(([event, callback]) => {
        target.removeEventListener(event, callback)
      })
    }
  }
}
