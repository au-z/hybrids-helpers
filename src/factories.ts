import { Descriptor, Property, UpdateFunctionWithMethods } from 'hybrids'
import { Disposable, Fn, Type } from './interfaces'
import { isClass } from './utils'

export interface RenderElement<T> extends HTMLElement {
  render: UpdateFunctionWithMethods<T>
}

export interface ContentElement<T> extends HTMLElement {
  render: UpdateFunctionWithMethods<T>
}

/**
 * Wrap a Property with a custom observer.
 * If an 'observe' Descriptor property is already defined, observe will be run after.
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
 * Create a readable/writable property sans attribute reflection
 * @param defaultValue the default getter value
 */
export const getset = <E, V>(defaultValue: V = undefined): Property<E, V> => ({
  get: (_, val = defaultValue) => val,
  set: (_, val) => val,
})

/**
 * Set a writeable property
 * @param defaultValue the default attribute value
 * @param setter a hook into the setter
 * @returns a Descriptor
 */
export const set = <E, V>(defaultValue: V, setter: Descriptor<E, V>['set']): Descriptor<E, V> => ({
  set: (host, val = defaultValue, last) => setter(host, val, last)
})

/**
 * Gets a reference to an element in the shadowDOM.
 * This property cannot be used during render to prevent circular references.
 * @param query the querySelector query
 * @returns a reference to an element in the shadowDOM
 */
export const ref = <E extends RenderElement<E>, Element>(query: string): Property<E, Element> => ({
  get: ({ render }: E & any) => render().querySelector(query),
})

/// Descriptor.connect ///

/**
 * A factory handling a Disposable object.
 * The disposed return value is assigned when removed from the DOM.
 * @param connector creates a Disposable constructor
 * @param ondisconnect to be run when the element is disconnected
 * @returns a disposable handler Hybrids property
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

/// Descriptor.observe ///

/**
 * An observer executing each passed observer in sequence
 * @param observers
 */
export const forEach = <E, V>(...observers: Descriptor<E, V>['observe'][]): Descriptor<E, V>['observe'] =>
  (host: E & HTMLElement, val: V, last: V) => observers.forEach((observe) => observe(host, val, last))

/**
 * An observer which sets a custom CSS property on the host element
 * @param variableName CSS property name
 * @param transform a function converting the JS to CSS value
 */
export const cssVar = <E, V>(
  variableName: string,
  transform: (val: V, host: E) => any = (val) => val
): Descriptor<E, V>['observe'] =>
  (host: E & HTMLElement, val: V) => {
    host.style.setProperty(variableName, transform(val, host))
  }
