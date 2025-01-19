import Alpine, { directive } from 'alpinejs'
import { alpine, build, hy } from '../index.js'

alpine.config(Alpine)

interface TestAlpine extends HTMLElement {
  disabled: boolean
}

const TestAlpine = build<TestAlpine>(({ shadow, html, reflect }) => ({
  tag: 'test-alpine',
  disabled: reflect(false),
  render: shadow(
    ({ disabled }) => html`
      <div x-host="{ open: false }">
        <div x-show="!disabled" :class="open ? '' : 'hidden'">
          <button @click="open = !open">Toggle Open</button>
          <div x-show="open">Open</div>
          <div x-show="!open">Closed</div>
        </div>
        <span x-show="disabled">Disabled</span>
        <button onclick="${toggleDisabled}">${disabled ? 'Enable' : 'Disable'}</button>
      </div>
    `
  ),
}))

function toggleDisabled(host: TestAlpine) {
  console.log('toggleDisabled')
  host.disabled = !host.disabled
}
