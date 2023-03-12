import { Descriptor, Property, UpdateFunctionWithMethods } from 'hybrids'
import { Disposable, Fn, Type } from './interfaces'
import { isClass } from './utils'

export interface RenderElement<T> extends HTMLElement {
  render: UpdateFunctionWithMethods<T>
}

/**
 * Wrap a Property with a custom observer. If an 'observe' Descriptor property is already defined, observe will be run after.
 * @param defaultValue the default property value
 */
export const prop = <E, V>(property: Property<E, V>, observe?: Descriptor<E, V>['observe']): Property<E, V> => {
  if(typeof property === 'object') {
    return {
      ...property,
      observe: (host, val, last) => {
        property.observe?.(host, val, last)
        observe?.(host, val, last)
      }
    }
  }

  return {
    [typeof property === 'function' ? 'get' : 'value']: property,
    observe: observe,
  }
}

/**
 * Create a read/write property sans attribute reflection. Can be helpful for managing exposed attributes or creating properties with complex data types.
 * ```
 * define({
 *   array: getset([]),
 *   _privateStr: getset(''),
 * })
 * ```
 * @category Descriptors
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param defaultValue the default value
 * @returns a Hybrids Descriptor
 * @see https://hybrids.js.org/#/component-model/structure?id=get-amp-set
 */
export const getset = <E, V>(defaultValue: V = undefined): Descriptor<E, V> => ({
  get: (_, val = defaultValue) => val,
  set: (_, val) => val,
})

/**
 * Set a writeable property.
 * ```
 * define({
 *   attr: set(''),
 *   capsAttr: set('', (host, set) => set.toUpperCase()),
 * })
 * ```
 * @category Descriptors
 * @param defaultValue the default attribute value
 * @param setter a hook into the setter
 * @returns a Descriptor
 * @see https://hybrids.js.org/#/component-model/structure?id=get-amp-set
 */
export const set = <E, V>(defaultValue: V, setter: Descriptor<E, V>['set']): Descriptor<E, V> => ({
  set: (host, val = defaultValue, last) => setter(host, val, last)
})

/**
 * Gets a reference to an element in the shadowDOM. This property cannot be used during render to prevent circular references.
 * ```
 * define({
 *   canvas: ref('canvas.container'),
 *   render: () => html`
 *     <canvas class="container"></canvas>
 *   `,
 * })
 * ```
 * @category Descriptors
 * @param query the querySelector query
 * @returns a reference to an element in the shadowDOM
 */
export const ref = <E, T extends Element = Element>(query: string): Descriptor<E, T> => ({
  get: ({ render }: E & HTMLElement & {render}) => render().querySelector(query),
})

/**
 * A factory handling a Disposable object. The disposed return value is assigned when removed from the DOM.
 * ```
 * define<any>({
 *   disposableClass: disposable((host) => MyClass),
 *   disposableFunction: disposable((host) => BarFoo),
 * })
 * 
 * class MyClass implements Disposable { ... }
 * 
 * function BarFoo() {
 *   return { dispose: ... }
 * }
 * ```
 * @category Descriptors
 * @typeParam E - host element type
 * @typeParam V - property type which extends Disposable
 * @param connector creates a Disposable constructor
 * @param ondisconnect to be run when the element is disconnected
 * @returns a disposable handler Hybrids property
 * @see /interfaces/Disposable.html
 */
 export const disposable = <E, V extends Disposable>(connector: (
  host: E & HTMLElement & { __property_key__: V },
  key: "__property_key__",
  invalidate: (options?: { force?: boolean }) => void,
) => Type<Disposable> | Fn<Disposable>, ondisconnect?: (host: E & HTMLElement) => void) => ({
  value: undefined,
  connect: (host, key, invalidate) => {
    const Ctor = connector(host, key, invalidate)
    const instance = isClass(Ctor) ? new (<Type<Disposable>>Ctor)() : (<Fn<Disposable>>Ctor)()
    host[key] = instance
    return () => {
      host[key] = host[key].dispose()
      if (ondisconnect) ondisconnect(host)
    }
  },
})

/// Descriptor.connect ///

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
 *   	 }))
 *   }
 * })
 * ```
 * @category Connectors
 * @typeParam E - host element type
 * @param eventMapFn a function returning a record of events and bound functions to listen
 * @returns A Descriptor['connect'] function
 */
export function listen<E>(eventMapFn: (host: E) => Record<string, ((e: Event) => void)>): NonNullable<Descriptor<E, any>['connect']> {
  return (host: E & HTMLElement) => {
    const eventMap = eventMapFn(host)
    Object.entries(eventMap).forEach(([event, callback]) => {
      host.addEventListener(event, callback)
    })
    return () => {
      Object.entries(eventMap).forEach(([event, callback]) => {
        host.removeEventListener(event, callback)
      })
    }
  }
}

/// Descriptor.observe ///

/**
 * An observer executing each passed observer in sequence
 * ```
 * define<MyElement>({
 *   color: {
 *     value: 'red',
 *     observe: forEach(
 *       cssVar('--my-element-color'),
 *       cssVar('--my-element-color-complement', (val, host) => complementaryColor(value)),
 *     ),
 *   },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param observers a list of 'observe' Descriptor functions to execute
 * @returns An 'observe' Descriptor function
 */
export const forEach = <E, V>(...observers: Descriptor<E, V>['observe'][]): NonNullable<Descriptor<E, V>['observe']> =>
  (host: E & HTMLElement, val: V, last: V) => observers.forEach((observe) => observe(host, val, last))

/**
 * An observer which reflects the current property value to a custom CSS property on the host element.
 * ```
 * define<MyElement>({
 *   color: { value: 'red', observe: cssVar('--my-element-color') },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param customProperty CSS custom property name
 * @param transform am optional function converting the JS to CSS value
 * @returns An 'observe' Descriptor function
 */
export const cssVar = <E, V>(
  customProperty: string,
  transform: (val: V, host: E) => any = (val) => val
): NonNullable<Descriptor<E, V>['observe']> =>
  (host: E & HTMLElement, val: V) => {
    host.style.setProperty(customProperty, transform(val, host))
  }

/**
 * Runs the observe function only when the current value is non-nullish.
 * ```
 * define({
 *   property: {
 *     ...getset(undefined),
 *     observe: nnull(cssVar(--custom-property)),
 *   },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param observe 'observe' function to execute when the value is not null or undefined
 * @param nullCallback optional 'observe' function when the value is nullish
 * @returns an 'observe' Descriptor
 */
export function nnull<E, V>(
  observe: Descriptor<E, V>['observe'],
  nullCallback?: Descriptor<E, V>['observe'],
): NonNullable<Descriptor<E, V>['observe']> {
  return (host: E & HTMLElement, value: V, last: V | undefined) => {
    if(value != null) {
      observe(host, value, last)
    } else {
      nullCallback?.(host, value, last)
    }
  }
}

/**
 * Runs the observe function only when the current value is truthy.
 * ```
 * define({
 *   property: {
 *     ...getset(''), // will not run on initial set
 *     observe: truthy(cssVar(--custom-property)),
 *   },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param observe 'observe' function to execute when the value is truthy
 * @param nullCallback optional 'observe' function when the value is falsy
 * @returns an 'observe' Descriptor
 */
export function truthy<E, V>(
  observe: Descriptor<E, V>['observe'],
  falsyCallback?: Descriptor<E, V>['observe'],
): NonNullable<Descriptor<E, V>['observe']> {
  return (host: E & HTMLElement, value: V, last: V | undefined) => {
    if(value) {
      observe(host, value, last)
    } else {
      falsyCallback?.(host, value, last)
    }
  }
}