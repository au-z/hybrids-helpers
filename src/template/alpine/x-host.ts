import Alpine from 'alpinejs'

function getHost(el) {
  if (el.host) return el.host
  if (el.parentNode) return getHost(el.parentNode)
  return null
}

/**
 *
 * @param data reactive data object
 * @param el element with a property to add to reactive data
 * @param key the property name to add
 */
function addToReactive<E extends HTMLElement>(data: ReturnType<typeof Alpine.reactive>, el: E, key: keyof E) {
  const desc = Object.getOwnPropertyDescriptor(el.constructor.prototype, key)
  if (desc && desc.get) {
    // assign getter to reactive data
    Object.defineProperty(el, key, {
      get() {
        const value = desc.get.call(this)
        data[key] = value
        return value
      },
      set: desc.set
        ? function (value) {
            data[key] = value
            return desc.set.call(this, value)
          }
        : undefined,
      configurable: true,
      enumerable: true,
    })
    data[key] = el[key]
  }
}

function hostData(el, props: string[]) {
  const data = Alpine.reactive({})
  for (const key in el) {
    if (key in HTMLElement.prototype || key === 'render') continue
    if (props?.length != null && !props.includes(key)) continue
    addToReactive(data, el, key)
  }
  return data
}

export function xHost(alpine: typeof Alpine) {
  return function (el, { value, modifiers, expression }, { evaluate }) {
    const host = getHost(el)
    if (host.constructor.name !== 'HybridsElement') {
      throw new Error('x-host directive must only be used inside a HybridsElement')
    }
    const props = expression ? evaluate(expression) : null
    alpine.addScopeToNode(el, hostData(host, props))
  }
}
