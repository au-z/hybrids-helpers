import { Descriptor } from 'hybrids'

export interface HostedMutationCallback<E extends HTMLElement = HTMLElement> {
  (host: E, mutations: MutationRecord[], observer: MutationObserver): void
}

/**
 * Creates a hybrid descriptor connect function for a MutationObserver
 * @param callback callback to execute on mutation
 * @param options observer options
 * @returns A Descriptor connect function
 */
export function mo<E extends HTMLElement>(
  options?: MutationObserverInit & {
    callback?: HostedMutationCallback<E>
  }
): Descriptor<E, any>['connect'] {
  return (host: E, key: string, invalidate: () => void) => {
    const observer = new MutationObserver((mutations, observer) => {
      invalidate()
      options.callback?.(host, mutations, observer)
    })
    observer.observe(host, options)
    return observer.disconnect
  }
}
