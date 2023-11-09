import { Property } from 'hybrids'
import { propertyToDescriptor } from 'src/utils'

/**
 * Protects a property from outside access
 * Can be used to develop more restrictive component APIs
 * @param property a normal Hybrids property to protect
 * @returns the protected property
 */
export const protect = <E, V>(property: Property<E, V>): Property<E, V> => {
  // const descriptor = propertyToDescriptor(property)
  // let ref
  // descriptor.connect = (host, key, invalidate) => {
  //   ref = host
  //   return descriptor.connect?.(host, key, invalidate)
  // }
  // // wrap descriptor in a proxy which only allows get if the callee is the ref
  // return new Proxy(descriptor, {
  //   get: (target, p, receiver) => {
  //     if (ref === receiver) {
  //       return Reflect.get(target, p, receiver)
  //     }
  //   },
  //   set: () => false,
  // })
}
