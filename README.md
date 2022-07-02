# hybrids-helpers
> Helper factories and functions for [Hybrids](https://hybrids.js.org/#/) Web Components.

## Motivation
For larger projects, Hybrids' delightfully simple API and terse syntax often requires additional helper factories.
In particular, if you find yourself implementing the same factory patterns and custom descriptors, 
this library may be helpful.

## Usage
```ts
import {cssVar, forEach, getset, prop, ref} from 'hybrids-helpers'

const MyComponent = define({
  tag: 'my-component',
  // define a property with optional observer
  booleanProperty: prop(false, forEach( // pass multiple handler observers
    // reflect value to a CSS variable on the host
    cssVar('--my-css-bit', (value) => value ? '1' : '0')
    (host, value, last) => console.log(`booleanProperty: ${last} -> ${value}`)
  )),
  // Define a property which is readable/writable but is not settable via attributes
  nonReflectedProperty: getset('I remain a readable/writable property'),
  // Obtain a reference to an element in the shadow DOM
  span: ref('#greeting'),
  render: () => html`<span id="greeting">Hello!</span>`
})
```

Factories can be composed to reduce Hybrids descriptor boilerplate:

```ts
{
  // a prop with getter and setter, defaulting to 'bar', which reflects it's value to '--my-foobar'
  foo1: prop(getset('bar'), cssVar('--my-foobar')),
  // equivalent hybrids 8.x descriptor
  foo2: {
    get: (host, val = 'bar') => val,
    set: (host, val) => val,
    observe: cssVar('--my-foobar'),
  },
}
```

## Installation
**hybrids-helpers** depends on hybrids >= 8.0.0

```bash
pnpm i @auzmartist/hybrids-helpers
```

## Documentation

