import { isClass } from 'src/utils'
import { Disposable, Fn, Type } from '../interfaces'
import { Descriptor } from 'hybrids'
import { getset } from './getset'

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
  ...getset(undefined),
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
