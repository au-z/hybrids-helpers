import { Descriptor, Property, UpdateFunctionWithMethods } from 'hybrids'
import { Disposable, Type } from './interfaces'

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
 * Create a readable/writable property without attribute reflection
 * @param defaultValue the default getter value
 */
export const getset = <E, V>(defaultValue: V): Property<E, V> => ({
  get: (_, val = defaultValue) => val,
  set: (_, val) => val,
})

/**
 * Gets a reference to an element in the shadowDOM
 * @param query the querySelector query
 * @returns a reference to an element in the shadowDOM
 */
export const ref = <E extends RenderElement<E>, Element>(query: string): Property<E, Element> => ({
  get: ({ render }: E & any) => render().querySelector(query),
})

/// Descriptor.connect ///


export const disposable = <E, V>(Ctor: Type<Disposable>, connect?: Descriptor<E, V>['connect']) => ({
  value: undefined,
  connect: (host, key, invalidate) => {
    host[key] = new Ctor(host)
    const ondisconnect = connect?.(host, key, invalidate)
    return () => {
      host[key].dispose()
      if (ondisconnect) ondisconnect()
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
 * An observer setting a custom CSS property on the host element
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
