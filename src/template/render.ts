import { Descriptor, RenderDescriptor, UpdateFunctionWithMethods } from 'hybrids'
/**
 * A direct port of the old Hybrids 6.1 render factory
 * https://hybrids.js.org/#/migration?id=render-factory
 * @category Render
 * @param desc the render descriptor
 */
export function render6<E>(fn: (host: E & HTMLElement) => UpdateFunctionWithMethods<E>, customOptions = {}) {
  if (typeof fn !== 'function') {
    throw TypeError(`The first argument must be a function: ${typeof fn}`)
  }

  const options = { shadowRoot: true, ...customOptions }
  const shadowRootInit = { mode: 'open' }

  if (typeof options.shadowRoot === 'object') {
    Object.assign(shadowRootInit, options.shadowRoot)
  }

  const getTarget = options.shadowRoot ? (host) => host.shadowRoot || host.attachShadow(shadowRootInit) : (host) => host

  return {
    get(host) {
      const update = fn(host)
      const target = getTarget(host)

      return function flush() {
        update(host, target)
        return target
      }
    },
    observe(host, flush) {
      flush()
    },
  }
}

/**
 * A direct port of the old Hybrids 9 render factory
 * https://hybrids.js.org/#/migration?id=render-factory
 * @category Render
 * @param desc the render descriptor
 * @returns a Hybrids descriptor
 * @throws TypeError if the 'reflect' option is used
 * @throws TypeError if the 'render' value is not a function
 */
export function render<E>(desc: RenderDescriptor<E>) {
  if (desc.reflect) {
    throw TypeError(`'reflect' option is not supported for 'render' property`)
  }

  const { value: fn, connect, observe } = desc

  if (typeof fn !== 'function') {
    throw TypeError(`Value for 'render' property must be a function: ${typeof fn}`)
  }

  const result = {
    connect,
    observe: observe
      ? (host, flush, lastFlush) => {
          observe(host, flush(), lastFlush)
        }
      : (host, flush) => {
          flush()
        },
  } as Descriptor<E, any>

  const shadow = desc.shadow
    ? {
        mode: (<ShadowRootInit>desc.shadow).mode || 'open',
        delegatesFocus: (<ShadowRootInit>desc.shadow).delegatesFocus || false,
      }
    : desc.shadow

  if (shadow) {
    result.value = (host) => {
      const target = host.shadowRoot || host.attachShadow(<ShadowRootInit>shadow)
      const update = fn(host)

      return () => {
        update(host, target)
        return target
      }
    }
  } else if (shadow === false) {
    result.value = (host) => {
      const update = fn(host)
      return () => {
        update(host, host)
        return host
      }
    }
  } else {
    result.value = (host) => {
      const update = fn(host)
      return () => update(host)
    }
  }

  return result
}
