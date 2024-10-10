export function set<E extends HTMLElement>(
  property: keyof E,
  extractor: (e: Event) => E[typeof property] = extractEventValue
) {
  return (host: E, e: Event) => (host[property] = extractor(e))
}

/**
 * Extract the value from an event heuristically.
 * @param e event
 * @returns the presumed value of the event
 */
function extractEventValue(e: Event) {
  if (e instanceof CustomEvent) {
    return e.detail
  }
  if (e.target instanceof HTMLInputElement && (e.target.type === 'checkbox' || e.target.type === 'radio')) {
    return e.target.checked
  } else {
    return (<any>e.target).value
  }
}
