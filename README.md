# hybrids-helpers

> Helper factories and functions for [Hybrids](https://hybrids.js.org/#/) Web Components.

## Installation

**hybrids-helpers** depends on hybrids >= 9.0.0

```bash
pnpm i @auzmartist/hybrids-helpers --save
```

## Documentation

```bash
pnpm docs:preview
```

## Motivation

For larger projects, Hybrids' delightfully simple API and terse syntax, while powerful, can result in some repetitive patterns and quality-of-life issues.
In particular, if you find yourself implementing the same factory patterns and custom descriptors across your projects, this library may be helpful to you.

## Usage
Hybrids offers deep configurability of each property which extends an HTMLElement.
This can come at the cost of long winded properties. Consider the following sample:

Let's define a web component with a single property "bool" with some custom behaviors.
"bool" should be false by default, but reflected as an attribute whenever it changes. It's value should also be set as a CSS Custom Property on the host AND logged to the console if truthy.

In Hybrids 9, we write this like so:
```ts
import { define, html } from 'hybrids'

define({
  tag: 'my-vanilla-component',
  bool: {
    value: false,
    reflect: true,
    observe(host, val, last) {
      if(!!val) {
        console.log(val)
      }
      host.style.setProperty('--custom-bit', val ? '1' : '0')
    }
  },
})
```

With hybrids-helpers, we can compress complex properties into functional poetry.

```ts
import { define, html } from 'hybrids'
import { reflect, effect, truthy, cssVar } from '@auzmartist/hybrids-helpers'

define({
  tag: 'my-helpers-powered-component',
  bool: reflect(effect(false,
    truthy((_, val) => console.log(val)),
    cssVar('--custom-bit', (val) => val ? '1' : '0')
  )),
})
```
Consult the full documentation for a complete list of helpers.

---

In 1.0.0, we introduce a `build` function to further simplify component writing.

```ts
import {build} from '@auzmartist/hybrids-helpers'

build(({ reflect, effect, truthy, cssVar }) => ({
  tag: 'my-component',
  bool: reflect(effect(false,
    truthy((_, val) => console.log(val)),
    cssVar('--custom-bit', (val) => val ? '1' : '0')
  ))
}))
```

The `build` function doesn't just simplify your imports. It provides safeguards around component re-definition, type currying, the full suite of exported helpers, and can even ornaments the html function for integration with other libraries like [AlpineJS](https://alpinejs.dev/start-here)

### Build

#### Safe Component Definition
The `build` helper provides save component definition to prevent accidental overwrites or naming conflicts.
```ts
define({tag: 'my-component', /* overwritten functionality */ })
define({tag: 'my-component', new: 'functionality' })

build(() => ({tag: 'my-safe-component', some: 'functionality' }))
build(() => ({tag: 'my-safe-component' })) // warns that the component is already defined.
```

Need to build now but compile later? Try `build.compile`. Works the same, but you can run `customElements.define()` later.

#### Type Currying
Hybrids has Typescript support, but component authors may find themselves type annotating the host repeatedly.

```ts
interface MyComponent extends HTMLElement {
  foo: string
  doubleFoo: string
}
define<MyComponent>({
  tag: 'my-component',
  foo: 'bar',
  doubleFoo: ({foo}: MyComponent) => `${foo}${foo}`,
})
```
The `build` helper can take care of the type inferencing for you. It's a small convenience, but it adds up.

```ts
interface MyComponent extends HTMLElement {
  foo: string
  doubleFoo: string
}
build<MyComponent>(() => ({
  tag: 'my-component',
  foo: 'bar',
  doubleFoo: ({foo}) => `${foo}${foo}`, // type annotations built-in
}))
```
To keep things terse, destructure your helpers when building elements:

```ts
build<any>(({ reflect, effect, cssVar }) => ({
  tag: 'my-component',
  // reflect the boolean to an attribute AND CSS custom property
  bool: reflect(effect(false, cssVar('--custom-bit'))),
}))
```

You 

In 1.0.0, we introduce a `build` function to further simplify component writing.

```ts
import {build} from '@auzmartist/hybrids-helpers'

build(({ reflect, effect, truthy, cssVar }) => ({
  tag: 'my-component',
  bool: reflect(effect(false,
    truthy((_, val) => console.log(val)),
    cssVar('--custom-bit', (val) => val ? '1' : '0')
  ))
}))
```

The `build` function doesn't just simplify your imports. It provides safeguards around component re-definition, type currying, the full suite of exported helpers, and can even provision the html function for integration with other libraries like [AlpineJS](https://alpinejs.dev/start-here)

### Build

#### Safe Component Definition
The `build` helper provides save component definition to prevent accidental overwrites or naming conflicts.
```ts
define({tag: 'my-component', /* overwritten functionality */ })
define({tag: 'my-component', new: 'functionality' })

build(() => ({tag: 'my-safe-component', some: 'functionality' }))
build(() => ({tag: 'my-safe-component' })) // warns that the component is already defined.
```

Need to build now but compile later? Try `build.compile`. Works the same, but you can run `customElements.define()` later.

#### Type Currying
Hybrids has Typescript support, but component authors may find themselves type annotating the host repeatedly.

```ts
interface MyComponent extends HTMLElement {
  foo: string
  doubleFoo: string
}
define<MyComponent>({
  tag: 'my-component',
  foo: 'bar',
  doubleFoo: ({foo}: MyComponent) => `${foo}${foo}`,
})
```
The `build` helper can take care of the type inferencing for you. It's a small convenience, but it adds up.

```ts
interface MyComponent extends HTMLElement {
  foo: string
  doubleFoo: string
}
build<MyComponent>(() => ({
  tag: 'my-component',
  foo: 'bar',
  doubleFoo: ({foo}) => `${foo}${foo}`, // type annotations built-in
}))
```
To keep things terse, destructure your helpers when building elements:

```ts
build<any>(({ reflect, effect, cssVar }) => ({
  tag: 'my-component',
  // reflect the boolean to an attribute AND CSS custom property
  bool: reflect(effect(false, cssVar('--custom-bit'))),
}))
```

You 

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

## Alpine
Perhaps you're finding the the Hybrids template syntax difficult to read? Or maybe you have a need for some pseudo-private 'scoped' data which is not exposed as a property on the host element?

AlpineJS may be useful in these cases:

```ts
// This is awful syntax to read, especially if you have an autoformatter
define({
  tag: 'my-hybrids-element',
  boolList: { value: [false, true, true, false, false ] },
  render: ({boolList}) => html`
    ${boolList.map((bool) => html`
      ${bool ? html`
        <span>Truthy Content</span>
      ` : html`
        <span>Falsy Content</span>
      `}
    `)}
  `.css`
    /* CSS */
  `
})
```
Instead, let's clean things up:
```ts
import Alpine from 'alpinejs'
import {alpine, build} from '@auzmartist/hybrids-helpers'
alpine.config(Alpine) // important to register Alpine

build(({be}) => ({
  tag: 'my-alpine-element',
  boolList: be([false, true, true, false, false]),
  render: () => alpine`
    <template x-host x-for="bool in boolList">
      <span x-text="bool ? 'Truthy Content' : 'Falsy Content'"></span>
    </template>
  `
}))
```
Note the use of the `x-host` custom Alpine directive. This reactively binds properties from Hybrids to the Alpine data scope.

You can scope `x-host` to specific properties if needed:

```ts
build(({be}) => ({
  // ...
  render: () => alpine`
    <template x-host="['boolList']" x-for="bool in boolList">
      <span x-text="bool ? 'Truthy Content' : 'Falsy Content'"></span>
    </template>
  `
}))
```

Shared state between Hybrids and Alpine is seamless. You can update the variable in Alpine or Hybrids and the property will change in the other reactivity system.

**Note:** One exception are Hybrids computed properties. For these, use the xhost directive to give Alpine a nudge to update.

```ts
build(({xhost, html}) => ({
  counter: {
    value: 0,
    connect(host, key, invalidate) {
      const int = setInterval(() => {
        host[key]++
      }, 500)
    }
  },
  double: xhost(({count}) => count * 2), // 'xhost' triggers re-rendering
  render: () => html`
    <span x-host x-text="double"></span>
  `
}))
```

Alpine passes data by attribute by default. This can be imcompatible with property-based templating conventions in other web component libraries. To pass state to HTML element properties, use the x-host directive:

```ts
alpine`<my-component x-prop.arr="[0, 1, 2]"></my-component>`
// OR
alpine`<my-component x-prop="{ arr: [0, 1, 2] }"></my-component>`
```

Both `x-host` and `x-prop` are included via `alpine.config()` as directives by default. If you'd like to customize Alpine further, adding your own directives, be sure to also include xHost and xProp directives manually:

```ts
import Alpine from 'alpinejs'
import { alpine } from '@auzmartist/hybrids-helpers'

alpine.config(Alpine, {
  host: alpine.xHost,
  prop: alpine.xProp,
  custom: ..., // https://alpinejs.dev/advanced/extending
})
```