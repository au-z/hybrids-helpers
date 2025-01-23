export function xHost(el, { expression }, { Alpine, evaluate }) {
  const host = getHost(el)
  if (host.constructor.name !== 'HybridsElement') {
    throw new Error('x-host directive must only be used inside a HybridsElement')
  }
  const props = expression ? evaluate(expression) : null
  Alpine.addScopeToNode(el, hostData(host, props, Alpine.reactive({})))
}

function getHost(el) {
  if (el.host) return el.host
  if (el.parentNode) return getHost(el.parentNode)
  return null
}

function hostData(el, props: string[], seed: object) {
  for (const key in el) {
    if (key in HTMLElement.prototype || key === 'render') continue
    if (props?.length != null && !props.includes(key)) continue
    addToReactive(seed, el, key)
  }
  return seed
}

/**
 *
 * @param data reactive data object
 * @param el element with a property to add to reactive data
 * @param key the property name to add
 */
function addToReactive<E extends HTMLElement>(data: Record<string, any>, el: E, key: keyof E) {
  const keyStr = key.toString()
  const desc = Object.getOwnPropertyDescriptor(el.constructor.prototype, key)
  if (desc && desc.get) {
    Object.defineProperty(el, key, {
      get() {
        data[keyStr] = desc.get.call(this)
        return data[keyStr]
      },
      set: desc.set
        ? function (value) {
            data[keyStr] = value
            return desc.set.call(this, data[keyStr])
          }
        : undefined,
      configurable: true,
      enumerable: true,
    })
    data[keyStr] = el[key]
  } else {
    console.warn('x-host: Property', key, 'has no getter.')
  }
}
