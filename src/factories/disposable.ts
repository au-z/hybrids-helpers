import { isClass } from '../utils'
import { Descriptor } from 'hybrids'

export interface Type<T> extends Function {
  new (...args: any[]): T
}

export type Fn<T> = (...args: any[]) => T

export interface Disposable {
  dispose: () => void
}

/**
 * A factory handling a Disposable object. The disposed return value is assigned when removed from the DOM.
 * ```
 * define<any>({
 *   disposableClass: disposable(MyClass),
 *   disposableFunction: disposable(BarFoo),
 * })
 *
 * class MyClass implements Disposable { ... }
 *
 * function BarFoo(host, key, invalidate) {
 *   return { dispose: ... }
 * }
 * ```
 * @category Descriptors
 * @typeParam E - host element type
 * @typeParam V - property type which extends Disposable
 * @param Ctor a Disposable constructor or function which returns a Disposable.
 * @returns a disposable handler Hybrids property
 * @see /interfaces/Disposable.html
 */
export const disposable = <E, V extends Disposable = Disposable>(
  Ctor: Type<Disposable> | Fn<Disposable>
): Descriptor<E, V> => ({
  value: undefined,
  connect: (host, key, invalidate) => {
    const instance = isClass(Ctor)
      ? new (<Type<Disposable>>Ctor)(host, key, invalidate)
      : (<Fn<Disposable>>Ctor)(host, key, invalidate)
    host[key] = instance as V
    return () => {
      host[key].dispose()
    }
  },
})
