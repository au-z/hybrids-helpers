import Alpine from 'alpinejs'
import { alpine, build, hy } from '@auzmartist/hybrids-helpers'
import { define } from 'hybrids'
alpine.config(Alpine)

interface TestAlpine extends HTMLElement {
  disabled: boolean
  count: number
  double: number
  list: { foo: string }[]
}

const TestAlpine = build<TestAlpine>(({ html, reflect, xhost }) => ({
  tag: 'test-alpine',
  disabled: reflect(false),
  count: {
    value: 0,
    connect: (host, key) => {
      setInterval(() => ++host[key], 500)
    },
  },
  double: xhost<number>(({ count }) => count * 2),
  list: { value: [{ foo: 'bar' }, { foo: 'baz' }] },
  /**
   * x-host is a custom directive used to mirror reactive data from Hybrids to Alpine scoped data.
   * This allows Alpine to react to changes in the Hybrids host data.

   * Use x-host without an attribute value ("x-host") to bind all non-native HTMLElement properties to the Alpine scope.

   * Re-renders are still triggered by Hybrids' reactivity system.
   * If your component is not re-rendering a getter, try to wrap it in 'xhost'
   */
  render: (host) => html`
    <div x-host x-data="{ open: false }">
      <div x-show="!disabled" :class="open ? '' : 'hidden'">
        <!-- 'open' acts like a "private" variable -->
        <button @click="open = !open">Toggle Open</button>
        <div x-show="open">Open</div>
        <div x-show="!open">Closed</div>
        <ul>
          <template x-for="item in list">
            <li x-text="item.foo"></li>
          </template>
        </ul>
      </div>
      <!-- reactive data sharing between Hybrids and Alpine -->
      <span x-show="disabled"><b>Disabled</b></span>
      <button @click="disabled = !disabled" x-text="disabled ? 'Enable: ' + double : 'Disable: ' + double"></button>
      <button onclick="${reverseList}">Reverse</button>
      <!-- test template composition -->
      ${hy.if(host.list[0].foo === 'bar', html`<p>First item is ${host.list[0].foo}</p>`)}
    </div>
  `,
}))

function reverseList(host) {
  host.list = [host.list[1], host.list[0]]
}

const AlpineTemplate = define<any>({
  tag: 'alpine-template',
  render: () => alpine`<section x-data="{ open: false }" :class="open ? '' : 'hidden'">
    <button @click="open = !open">Toggle</button>
    <div x-show="open">Hello</div>
  </section>`,
})
