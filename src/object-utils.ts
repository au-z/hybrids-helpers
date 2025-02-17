/**
 * Track a property descriptor on an object and reflect changes to a target object.
 * Can be used to bind Hybrids properties to Alpine data or any other object.
 * Especially useful for binding data to a reactive target to trigger side effects.
 *
 * @param obj the source object
 * @param key a key on the source object
 * @param target a target to reflect the changes
 * @param options options for the property descriptor
 *   - immutable: if true, the target will be updated immutably
 *   - configurable: if true, the property descriptor will be configurable
 *   - enumerable: if true, the property descriptor will be enumerable
 * @returns an updated target object
 */
export function trackPropertyDescriptor<E extends object = object>(
  obj: E,
  key: keyof E,
  target: object,
  options?: {
    immutable?: boolean
    configurable?: boolean
    enumerable?: boolean
  }
) {
  const { immutable = false, configurable = true, enumerable = true } = options || {}
  const desc = Object.getOwnPropertyDescriptor(obj.constructor.prototype, key)
  if (desc && desc.get) {
    Object.defineProperty(obj, key, {
      get() {
        const next = desc.get.call(this)
        if (next !== target[<any>key]) {
          console.log(target)

          if (immutable) {
            target = { ...target, [key]: next }
          } else {
            target[<any>key] = next
          }
        }
        return next
      },
      set: desc.set
        ? function (value) {
            if (value !== target[<any>key]) {
              if (immutable) {
                target = { ...target, [key]: value }
              } else {
                target[<any>key] = value
              }
            }
            return desc.set.call(this, target[<any>key])
          }
        : undefined,
      configurable,
      enumerable,
    })

    if (immutable) {
      target = { ...target, [key]: obj[key] }
      console.log(obj, key, obj[key], target)
    } else {
      target[<any>key] = obj[key]
    }
  }

  return target
}

export function deepMerge(target: any, source: any) {
  const output = { ...target }
  if (isObj(target) && isObj(source)) {
    Object.keys(source).forEach((key) => {
      if (isObj(source[key])) {
        if (!(key in target)) {
          output[key] = source[key]
        } else {
          output[key] = deepMerge(target[key], source[key])
        }
      } else {
        output[key] = source[key]
      }
    })
  }
  return output
}

function isObj(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
