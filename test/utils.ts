export interface SpecOptions {
  delayMount?: boolean;
}
export interface Spec<T> {
  ref: (refSelectors: Record<string, string>) => Spec<T>;
  set: (fn: (el: T, refs: Record<string, any>) => void) => Spec<T>;
  readonly tree: (
    spec: (el: T, refs: Record<string, any>, mount: Function) => void,
    options?: SpecOptions
  ) => () => any;
}

export function setup<T extends HTMLElement = any>(html): Spec<T> {
  const template = document.createElement('template');
  template.innerHTML = html;

  let _refSelectors: Record<string, string> = {};
  let _setup = (el: T, refs: Record<string, any>) => {};

  const api: Spec<T> = {
    ref(refSelectors: Record<string, string> = {}) {
      _refSelectors = refSelectors;
      return this;
    },
    set(fn: (el: T, refs: Record<string, any>) => void) {
      _setup = fn;
      return this;
    },
    get tree() {
      return (spec: (el: T, refs: Record<string, any>, mount: Function) => void, options?: SpecOptions) => () => {
        const wrapper = document.createElement('div');
        document.body.appendChild(wrapper);
        const frag = template.content.cloneNode(true) as DocumentFragment;
        const mount = (node) => wrapper.appendChild(node);

        !options?.delayMount && mount(frag);
        const testDOM = <T>(options?.delayMount ? frag.children[0] : wrapper.children[0]);
        const refs = {};
        for (const key in _refSelectors) {
          if (_refSelectors[key]) {
            refs[key] = testDOM.querySelector(_refSelectors[key]);
          }
        }

        try {
          _setup?.(wrapper.children[0] as T, refs);
          const result = spec(testDOM, refs, mount);
          return Promise.resolve(result).then(() => {
            requestAnimationFrame(() => {
              document.body.removeChild(wrapper);
            });
          });
        } catch (ex) {
          requestAnimationFrame(() => {
            document.body.removeChild(wrapper);
          });
          throw ex;
        }
      };
    },
  };

  return api;
}

export const tick = (ms?: number) => new Promise((res) => (ms ? setTimeout(res, ms) : requestAnimationFrame(res)));
