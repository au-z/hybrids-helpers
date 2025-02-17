import { build, alpine } from '../src/index.js'
import Alpine from 'alpinejs'
alpine.config(Alpine)

interface TestFixture extends HTMLElement {
  component: Element | null
  props: Record<string, any>
}

export const TestFixture = build<TestFixture>(({ html, slotted, be }) => ({
  tag: 'test-fixture',
  component: {
    ...slotted(),
    connect(host: TestFixture) {
      const component = host['component']
      if (!component) return () => {}

      // ensure component is registered
      requestAnimationFrame(() => {
        const proto = Object.getPrototypeOf(component)
        bindProps(component, host)
      })
    },
  },
  props: be({}),
  render: () => html`
    <div x-host>
      <div class="props" style="display: flex; gap: 0.5rem;">
        <template x-for="[name, value] in Object.entries(props)">
          <div class="prop">
            <span :title="value" x-text="name"></span>
            <pre x-text="value"></pre>
          </div>
        </template>
      </div>
      <slot></slot>
    </div>
  `.css`
    :host {
      display: inline-block;
    }
    .props {
      display: flex;
      gap: 0.5rem;
      margin: 0.5rem 0;
    }
    .prop {
      display: flex;
      align-items: center;
      border-radius: 1rem;
      overflow: hidden;
      color: #b8babd;
      & > span {
        padding: 0.25rem 0.5rem;
        background: #4a4b4d;
      }
      & > pre {
        margin: 0;
        font-family: monospace;
        padding: 0.25rem 0.5rem;
        background: #3a3b3d;
      }
    }
  `,
}))

function bindProps(component: Element, host: TestFixture) {
  const ctor = customElements.get(component.tagName.toLowerCase())
  if (!ctor) return () => {}

  for (const key in ctor.prototype) {
    if (!(key in HTMLElement.prototype) && key !== 'render') {
      const desc = Object.getOwnPropertyDescriptor(ctor.prototype, key)
      if (desc && desc.get && typeof component[key] !== 'function') {
        host.props = { ...host.props, [key]: component[key] }

        Object.defineProperty(component, key, {
          get() {
            const next = desc?.get?.call(this)
            host.props = { ...host.props, [key]: next }
            return next
          },
          set: desc.set
            ? function (value) {
                if (value !== host.props[key]) {
                  host.props = { ...host.props, [key]: value }
                }
                return desc?.set?.call(this, host.props[key])
              }
            : undefined,
          configurable: true,
          enumerable: true,
        })
      }
    }
  }
}
