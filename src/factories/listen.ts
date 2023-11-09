import { Descriptor } from 'hybrids'

/**
 * Listen to a map of events. Handles listener registration and deregistration.
 * ```
 * define<any>({
 *   foo: 0,
 *   incrementFoo: (host) => (e) => host.foo++,
 *   _connect: {
 *   	 value: undefined,
 *   	 connect: listen((host: any) => ({
 *   	  'foo': host.incrementFoo,
 *
 *   }
 * })
 * ```
 * @category Connectors
 * @typeParam E - host element type
 * @param eventMapFn a function returning a record of events and bound functions to listen
 * @returns A Descriptor['connect'] function
 */
export function listen<E>(
  eventMapFn: (host: E) => Record<string, (e: Event) => void>
): NonNullable<Descriptor<E, any>['connect']> {
  return (host: E & HTMLElement) => {
    const eventMap = eventMapFn(host)
    Object.entries(eventMap).forEach(([event, callback]) => {
      host.addEventListener(event, (e) => {
        callback(e)
      })
    })
    return () => {
      Object.entries(eventMap).forEach(([event, callback]) => {
        host.removeEventListener(event, callback)
      })
    }
  }
}
