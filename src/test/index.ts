export interface SpecOptions<T> {
  delayMount?: boolean
  afterDisconnect?: (el: T) => void
}
export interface Spec<T> {
  ref: (refSelectors: Record<string, string>) => Spec<T>
  set: (fn: (el: T, refs: Record<string, any>) => void) => Spec<T>
  readonly tree: (
    spec: (el: T, refs: Record<string, any>, mount: Function) => void,
    options?: SpecOptions<T>
  ) => () => any
}

export function setup<T extends HTMLElement = any>(html): Spec<T> {
  const template = document.createElement('template')
  template.innerHTML = html

  let _refSelectors: Record<string, string> = {}
  let _setup = (el: T, refs: Record<string, any>) => {}

  const api: Spec<T> = {
    ref(refSelectors: Record<string, string> = {}) {
      _refSelectors = refSelectors
      return this
    },
    set(fn: (el: T, refs: Record<string, any>) => void) {
      _setup = fn
      return this
    },
    get tree() {
      return (
          spec: (el: T, refs: Record<string, any>, mount: Function) => void | Promise<void>,
          options?: SpecOptions<T>
        ) =>
        async () => {
          const wrapperDiv = document.createElement('div')
          document.body.appendChild(wrapperDiv)
          const frag = template.content.cloneNode(true) as DocumentFragment

          const mount = (node: Node) => wrapperDiv.appendChild(node)
          !options?.delayMount && mount(frag)

          const testDOM = <T>(options?.delayMount ? frag.children[0] : wrapperDiv.children[0])
          const refs = {}
          for (const key in _refSelectors) {
            if (_refSelectors[key]) {
              refs[key] = testDOM.querySelector(_refSelectors[key])
            }
          }

          try {
            _setup?.(wrapperDiv.children[0] as T, refs)

            await tick()
            const result = await spec(testDOM, refs, mount)
            return result
          } finally {
            if (wrapperDiv.parentNode === document.body) {
              document.body.removeChild(wrapperDiv)
              wrapperDiv.removeChild(testDOM)
            }
            options?.afterDisconnect?.(testDOM)
          }
        }
    },
  }

  return api
}

export const tick = (ms?: number) => new Promise((res) => (ms ? setTimeout(res, ms) : requestAnimationFrame(res)))
