import { evaluateLater, type Alpine } from 'alpinejs'

function getHost(el) {
  if (el.host) return el.host
  if (el.parentNode) {
    return getHost(el.parentNode)
  } else {
    return null
  }
}

function hostData(el) {
  const data = {}
  for (const key in el) {
    if (key in HTMLElement.prototype || key === 'render') continue
    data[key] = el[key]
  }
  return data
}

export function xHost(alpine: Alpine) {
  return function (el, { value, modifiers, expression }, { evaluateLater }) {
    const host = getHost(el)
    if (host.constructor.name !== 'HybridsElement') {
      throw new Error('x-host directive must only be used inside a HybridsElement')
    }
    const evaluate = evaluateLater(expression)

    evaluate((data) => {
      if (typeof data === 'object') {
        alpine.addScopeToNode(el, { ...data, ...hostData(host) })
        console.log({ ...data, ...hostData(host) })
      } else {
        throw new Error('x-host expects an object from x-data')
      }
    }).before('data')
  }
}
