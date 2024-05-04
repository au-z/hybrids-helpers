import { Descriptor, Property } from 'hybrids'
import { Invalidate, Mixin, propertyToDescriptor } from './utils'

export type Provide<T> = <H, Keys extends keyof H>(
  mapper: (providers: {
    [K in keyof T]: Property<H, T[K]>
  }) => {
    [K in Keys]: Property<H, H[K]>
  },
  unsafe?: boolean
) => {
  [K in Keys]: Property<H, H[K]>
}

/**
 * A factory for creating a contextual properties and a provider to access them from child elements.
 * This can be used to pass context while avoiding prop drilling.
 * ```
 * const [apiContex, provideApi] = context<{apiKey: string}>({
 *   apiKey: 'UNSET',
 * })
 * define<ContextProvider>({
 *   tag: 'context-provider',
 *   ...apiContext,
 * })
 *
 * define<ContextInheritor>({
 *   tag: 'context-inheritor',
 *   ...provideApi(({apiKey}) => ({apiKey})),
 * })
 * ```
 * @category Context
 * @typeParam T - the type of the context object
 * @param context a Hybrids mixin with properties to provide.
 * @param options.verbose - log invalidations to the console. (default: false)
 * @param options.strict - prevent provide if no context host is found first. (default: false)
 * @returns a tuple with the decorated context mixin and a provider function.
 */
export function context<T>(
  context: Mixin<T>,
  options?: { verbose?: boolean; strict?: boolean }
): [Mixin<T>, Provide<T>] {
  options = {
    verbose: false,
    strict: false,
    ...options,
  }

  let contextHost: T & HTMLElement
  const cache: {
    [K in keyof T]?: Invalidate<T, K>[]
  } = {}

  context = Object.keys(context).reduce((result, key) => {
    cache[key] = []
    const descriptor = propertyToDescriptor(context[key])

    result[key] = {
      ...descriptor,
      connect: (host: T & HTMLElement & { __property_key__: any }, key, invalidate) => {
        if (!contextHost) contextHost = host
        const disconnect = descriptor.connect?.(host, key, invalidate)
        return () => {
          disconnect && disconnect()
          contextHost = undefined
        }
      },
      observe: (host, val, last) => {
        descriptor.observe?.(host, val, last)
        cache[key].forEach((invalidate) => invalidate())
      },
    }

    return result
  }, {} as Mixin<T>)

  /**
   * Provide context to inheritor elements.
   * @param mapper a function which receives the context and maps to inheritor properties.
   * @param unsafe whether to allow inheriting from a non-descendant.
   * @returns the properties to map onto the inheritor.
   */
  const provide: Provide<T> = function <H>(mapper, unsafe = false) {
    if (options.strict && !contextHost) {
      console.error('Context host is undefined. Did you forget to register context with a parent component?')
      return {} as any
    }

    let providedHost
    let isDescendant = false
    const allow = () => isDescendant || unsafe

    const providers = Object.keys(context).reduce((providers, key) => {
      providers[key] = {
        // get the value of the context property
        get: (host: H, val) => (allow() ? contextHost?.[key] : val),
        // add the invalidate function to the cache
        connect: connectDescendant((host: H & HTMLElement, key: string, invalidate: Function) => {
          if (!cache[key]) cache[key] = []
          function inv() {
            options.verbose && console.log(`invalidating ${host.tagName}.${key}`)
            invalidate()
          }
          cache[key].push(inv)

          return () => {
            // remove the invalidate function from the cache
            const idx = cache[key].indexOf(inv)
            if (idx >= 0) cache[key].splice(idx, 1)
          }
        }, unsafe),
      }
      return providers
    }, {})

    return mapper(providers)

    /// helper functions

    function connectDescendant(connect: Descriptor<H, any>['connect'], unsafe = false) {
      return (host: H & HTMLElement & { __property_key__: string }, key, invalidate) => {
        if (!providedHost) providedHost = host
        isDescendant = isParent(providedHost, contextHost)
        if (allow()) {
          connect(host, key, invalidate)
        } else {
          console.error(
            `Cannot inherit. ${host.tagName} is not a child of ${contextHost?.tagName}.\n\tTo suppress this, set the 'unsafe' flag on the provide function.`
          )
        }
      }
    }
  }

  return [context, provide]
}

function isParent(node: Node, test: Node) {
  while (test && node) {
    if (node === test) return true
    node = node.parentNode
  }
  return false
}
