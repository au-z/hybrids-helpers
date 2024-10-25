import { html } from 'hybrids'
import { build, hy, mo, nnull, ref, refs, slotted } from '../index.js'

interface DemoComponent extends HTMLElement {
  bool: boolean
  number: number
  double: number
  string: string
  formatted: string
  object: { foo: string }
  textInputEl: HTMLInputElement | null
  inputs: HTMLInputElement[]
  inputValue: string
  checkboxValue: boolean
  disposable: { dispose: () => void }
  mouse: { x: number; y: number }
  xy: string
  dims: { width: number; height: number }
  directChildren: Element[]
  slotted: Element | null
}

export const DemoComponent = build<DemoComponent>(({ prop, effect, be, disposable, mouse, reflect, ro, set }) => ({
  tag: 'demo-component',
  bool: false,
  number: 0,
  double: be((host) => (host.number *= 2)),

  // any property (equal to {value: 'test_string'})
  string: prop({ value: 'test_string' }),

  // create a computed value, also register an effect every time the property changes
  formatted: effect(
    ({ string }) => `Formatted: ${string}`,
    () => console.log(`'formatted' was updated`)
  ),

  // store a value (even an object)
  object: be({ foo: 'bar' }),
  // update the object.foo property from the input
  inputValue: effect(
    '',
    nnull((host, foo) => {
      host.object = { foo: !foo ? 'bar' : foo }
    })
  ),

  textInputEl: ref('#text-input'),
  inputs: refs('input'),

  checkboxValue: effect(
    false,
    nnull((host, checked) => {
      host.bool = checked
    })
  ),

  // create an object which auto-disposes on disconnect
  disposable: disposable(Logger),

  // record the mouse position as {x, y}
  mouse: mouse(),

  // reflect a computed position string to an attribute
  xy: reflect(({ mouse }) => `${mouse.x}, ${mouse.y}`),

  // recompute when the host is resized
  dims: ro((host) => {
    const { width, height } = host.getBoundingClientRect()
    return { width, height }
  }),

  // keep a live reference to light DOM children
  directChildren: mo((host, last) => (last ? last : Array.from(host.children)), { childList: true }),
  slotted: slotted(),

  render: ({ bool, string, formatted, object, mouse, dims, directChildren }) =>
    html`
      <input id="text-input" oninput="${set('inputValue')}" placeholder="update object.foo" />
      <br />
      <p>Set Checkbox: <input style="display: inline-block;" type="checkbox" oninput="${set('bool')}" /></p>
      <br />
      ${hy.keyvalue(
        { bool, string, formatted, object, mouse, dims },
        (key, value) =>
          html` <span><b>${key}: </b></span>
            <pre>${JSON.stringify(value)}</pre>
            <br />`
      )}
      <span><b>directChildren count: </b></span>
      <pre>${directChildren.length}</pre>
      <br />
      <slot></slot>
    `.css`
      :host {
        display: block;
        outline: 1px solid white;
        padding: 3rem;
        transition: 0.3s background ease;
      }
      pre {
        display: inline-block;
        margin: 0;
      }
    `,
}))

function Logger() {
  console.log('Logger constructed')
  return {
    dispose() {
      // do disposal work
      console.log('Logger disposed')
    },
  }
}
