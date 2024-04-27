import { Property } from 'hybrids'
import { Invalidate, Mixin, propertyToDescriptor } from './utils'

export type Provide<T> = <H, Keys extends keyof H>(
  mapper: (providers: {
    [K in keyof T]: Property<H, T[K]>
  }) => {
    [K in Keys]: Property<H, H[K]>
  }
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
 * @returns a tuple with the decorated context mixin and a provider function.
 */
export function context<T>(context: Mixin<T>): [Mixin<T>, Provide<T>] {
  let contextHost: T
  // a cache of invalidate functions
  // when the context property changes, we call all the invalidate functions
  // invalidate functios are added to the cache in each provided property
  const subscriptions: {
    [K in keyof T]?: Invalidate<T, K>[]
  } = {}

  context = Object.keys(context).reduce((result, key) => {
    subscriptions[key] = []
    const descriptor = propertyToDescriptor(context[key])

    result[key] = {
      ...descriptor,
      connect: (host, key, invalidate) => {
        if (!contextHost) contextHost = host
        const disconnect = descriptor.connect?.(host, key, invalidate)
        return () => {
          disconnect && disconnect()
          contextHost = undefined
        }
      },
      observe: (host, val, last) => {
        descriptor.observe?.(host, val, last)
        subscriptions[key].forEach((invalidate) => invalidate())
      },
    }

    return result
  }, {} as Mixin<T>)

  const provide: Provide<T> = function <H>(mapper) {
    const providers = Object.keys(context).reduce((providers, key) => {
      providers[key] = {
        // get the value of the context property
        get: (host: H, val) => contextHost[key],
        // add the invalidate function to the cache
        connect: (host: H, key, invalidate) => {
          if (!subscriptions[key]) subscriptions[key] = []
          subscriptions[key].push(invalidate)

          return () => {
            // remove the invalidate function from the cache
            const idx = subscriptions[key].indexOf(invalidate)
            if (idx >= 0) subscriptions[key].splice(idx, 1)
          }
        },
      }
      return providers
    }, {})

    return mapper(providers)
  }

  return [context, provide]
}
