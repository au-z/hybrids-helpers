import { propertyToDescriptor } from '@src/utils.js'
import { Property } from 'hybrids'
const XHOST = '_x_host_proxy_'

/**
 * Alpine directive which binds select properties to the existing Alpine data scope.
 * @param el the element to which to apply data
 */
export function xHost(el, { expression }, { Alpine, evaluate }) {
  const host = getNearestHybridsHost(el)
  if (host.constructor.name !== 'HybridsElement') {
    throw new Error('x-host directive must only be used inside a HybridsElement')
  }
  const props = expression ? evaluate(expression) : null
  host[XHOST] = hostData(host, props, Alpine.reactive({}), Alpine)
  Alpine.addScopeToNode(el, host[XHOST])
}

// get the nearest host element OR if not shadow DOM, the nearest HybridsElement
function getNearestHybridsHost(el) {
  if (el.host) return el.host
  else if (el.constructor.name === 'HybridsElement') return el
  if (el.parentNode) return getNearestHybridsHost(el.parentNode)
  return null
}

function hostData(el, props: string[], seed: object, Alpine) {
  for (const key in el) {
    if ((props?.length == null && key in HTMLElement.prototype) || key === 'render') continue
    if (props?.length != null && !props.includes(key)) continue
    addToReactive(seed, el, key, Alpine)
  }
  return seed
}

/**
 *
 * @param data reactive data object
 * @param el element with a property to add to reactive data
 * @param key the property name to add
 */
function addToReactive<E extends HTMLElement>(data: Record<string, any>, el: E, key: keyof E, Alpine) {
  const keyStr = key.toString()
  const desc = Object.getOwnPropertyDescriptor(el.constructor.prototype, key)
  if (desc && desc.get) {
    // bind Hybrids updates to Alpine data scope
    Object.defineProperty(el, key, {
      get() {
        const next = desc.get.call(this)
        if (next !== data[keyStr]) {
          data[keyStr] = next
        }
        return next
      },
      set: desc.set
        ? function (value) {
            if (value !== data[keyStr]) {
              data[keyStr] = value
            }
            return desc.set.call(this, data[keyStr])
          }
        : undefined,
      configurable: true,
      enumerable: true,
    })
    data[keyStr] = el[key]

    // update host properties when Alpine data changes
    if (desc.set) {
      Alpine.effect(() => {
        el[keyStr] = data[keyStr]
      })
    }
  } else {
    console.warn('x-host: Property', key, 'has no getter.')
  }
}

/**
 * Bind a computed property to the Alpine data scope on update.
 * @param property any Hybrids property
 */
export const xhost = <E, V>(property: Property<E, V>) => {
  const descriptor = propertyToDescriptor(property as Property<E, V>)
  let key
  return {
    ...descriptor,
    connect(host, _key) {
      key = _key
      if (!host[XHOST]) {
        console.warn('Element does not use the x-host Alpine diretive.')
      }
    },
    observe(host, value, last) {
      if (value !== last && host[XHOST]) {
        host[XHOST][key] = value
      }
    },
  }
}
