# hybrids-helpers

> Helper factories and functions for [Hybrids](https://hybrids.js.org/#/) Web Components.

## Motivation

For larger projects, Hybrids' delightfully simple API and terse syntax can reveal some repetitive patterns which can be expressed as property factories.
In particular, if you find yourself implementing the same factory patterns and custom descriptors across your projects, this library may be helpful to you.

## Usage

### Factories

```ts
import { cssVar, forEach, prop, ref, slotted, mouse } from 'hybrids-helpers'

const MyComponent = define({
  tag: 'my-component',
  // define a property with optional observer
  booleanProperty: effect(
    false,
    // reflect value to a CSS variable on the host
    cssVar('--my-css-bit', (value) => (value ? '1' : '0')),
    (host, value, last) => console.log(`booleanProperty: ${last} -> ${value}`)
  ),
  // Obtain a reference to an element in the shadow DOM
  span: ref('#greeting'),
  // get a reference to a slotted element from the light-DOM
  slottedElement: slotted('my-slot'),
  // track the mouse position within the element
  mousePosition: mouse({ clamp: true }),
  render: () => html`<span id="greeting">Hello!<slot name="my-slot"></slot></span>`,
})
```

Factories can be composed to reduce Hybrids descriptor boilerplate:

```ts
{
  // a prop with a value of 'bar', which reflects it's value to '--my-foobar'
  foo1: effect('bar', cssVar('--my-foobar')),
  // equivalent hybrids 8.x descriptor
  foo2: {
    get: (host, val = 'bar') => val,
    set: (host, val) => val,
    observe: cssVar('--my-foobar'),
  },
}
```

### Templating

It can be difficult to manage complex templates in a single render function. The `hy` templating functions can help to break up the template into smaller, more manageable parts.

```ts
import { hy } from '@auzmartist/hybrids-helpers'

const template = (host: { type: string }) => html`
  <div>
    ${hy.if(host.type === 'foo', html`<span>Foo</span>`)}
    ${hy.case(host.type, {
      foo: html`<span>Foo</span>`,
      bar: html`<span>Bar</span>`,
      baz: html`<span>Baz</span>`,
      default: html`<span>Default</span>`,
    })}
  </div>
`
```

## Installation

**hybrids-helpers** depends on hybrids >= 9.0.0

```bash
pnpm i @auzmartist/hybrids-helpers
```

## Documentation

```bash
pnpm docs:preview
```
