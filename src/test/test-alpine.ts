import Alpine from 'alpinejs'
import { alpine, build } from '../index.js'

alpine.config(Alpine)

interface TestAlpine extends HTMLElement {
  disabled: boolean
  count: number
  double: number
}

const TestAlpine = build<TestAlpine>(({ shadow, html, reflect }) => ({
  tag: 'test-alpine',
  disabled: reflect(false),
  count: {
    value: 0,
    connect: (host, key) => {
      setInterval(() => ++host[key], 500)
    },
  },
  double: ({ count }) => count * 2,
  render: shadow(
    ({ disabled, double }) => html`
      <!--
        x-host is a custom directive used to mirror reactive data from Hybrids to Alpine scoped data.
        This allows Alpine to react to changes in the Hybrids host data.
        Re-renders are still triggered by Hybrids' reactivity system.
        If your comonent is not re-rendering, check that the re-render is being triggered.

        Use x-host without an attribute value ("x-host") to bind all non-native HTMLElement properties to the Alpine scope.
      -->
      <div x-host="['disabled', 'double']" x-data="{ open: false }">
        <div x-show="!disabled" :class="open ? '' : 'hidden'">
          <!-- 'open' acts like a "private" variable -->
          <button @click="open = !open">Toggle Open</button>
          <div x-show="open">Open</div>
          <div x-show="!open">Closed</div>
        </div>
        <!-- reactive data sharing between Hybrids and Alpine -->
        <span x-show="disabled"><b>Disabled</b></span>
        <!-- Hybrids onX handler to update Hybrids data directly -->
        <button onclick="${toggleDisabled}" x-text="disabled ? 'Enable: ' + double : 'Disable: ' + double"></button>
      </div>
    `
  ),
}))

function toggleDisabled(host: TestAlpine) {
  console.log('toggleDisabled')
  host.disabled = !host.disabled
}
