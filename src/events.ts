/**
 * dispatch a CustomEvent from the host element which bubbles and is composed
 * @param host the host element
 * @param event the event name
 * @param detail the CustomEvent detail
 * @param init CustomEventInit options to override the defaults (bubbles, composed)
 * @returns void
 */
export function emit<T>(host: Element, event: string, detail: T, init: CustomEventInit<any> = {}) {
  host.dispatchEvent(new CustomEvent<T>(event, { detail, bubbles: true, composed: true, ...init }))
}

/**
 * wrap an event handler to stop propagation
 * @param handler - the event handler to wrap
 * @returns a new event handler that stops propagation
 */
export const stop = <H, T = any>(handler: (host: H, e: CustomEvent<T>) => void) => {
  return (host: H & HTMLElement, e: CustomEvent<T>) => {
    e.stopPropagation()
    handler(host, e)
  }
}

/**
 * wrap an event handler to prevent the default action
 * @param handler - the event handler to wrap
 * @returns a new event handler that prevents the default action
 */
export const prevent = <H, T = any>(handler: (host: H, e: CustomEvent<T>) => void) => {
  return (host: H & HTMLElement, e: CustomEvent<T>) => {
    e.preventDefault()
    handler(host, e)
  }
}
