import { Component, Descriptor as Desc, define as hy_define, Property as Prop, RenderFunction } from 'hybrids'
import { emit, prevent, stop } from './events.js'
import { Disposable as Disp, disposable, Fn, Type } from './factories/disposable.js'
import { effect } from './factories/effect.js'
import { HostedMutationCallback, mo } from './factories/mo.js'
import { mouse } from './factories/mouse.js'
import { reflect } from './factories/reflect.js'
import { ro } from './factories/ro.js'
import { ref, refs } from './refs/ref.js'
import { slotted } from './refs/slotted.js'
import { hy } from './template/hy.js'
import { set } from './template/set.js'

// descriptor factories
export * from './connect/connect.js'
export * from './connect/listen.js'
export * from './factories.js'
export * from './factories/disposable.js'
export * from './factories/effect.js'
export * from './factories/getset.js'
export * from './factories/mo.js'
export * from './factories/mouse.js'
export * from './factories/reflect.js'
export * from './factories/ro.js'
export * from './observe.js'

// refs
export * from './refs/ref.js'
export * from './refs/slotted.js'

// connectors
export * from './connect/listen.js'

// rendering
export * from './template/light.js'
export * from './template/render.js'

// templating
export * from './events.js'
export * from './template/hy.js'

// utils
export { propertyToDescriptor } from './utils.js'

/**
 * @returns type-curried helpers for building Hybrid components.
 */
export const HybridBuilder = <E extends HTMLElement>() => ({
  prop: <V = any>(property: Prop<E, V>) => property,
  be: <V = any>(value: Desc<E, V>['value']) => ({ value } as Desc<E, V>),

  // extensions of hybrids-helpers
  disposable: <V extends Disp = Disp>(Ctor: Type<Disp> | Fn<Disp>) => disposable<E, V>(Ctor),
  effect: <V = any>(property: Prop<E, V>, ...effects: Desc<E, V>['observe'][]) => effect<E, V>(property, ...effects),
  mo: <V = any>(prop: Prop<E, V>, init: MutationObserverInit & { callback?: HostedMutationCallback<E> }) =>
    mo<V, E>(prop, init),
  mouse: mouse<E>,
  reflect: <V>(prop: Prop<E, V>, bidirectional = false) => reflect<E, V>(prop, bidirectional),
  ro: <V = any>(prop: Prop<E, V>) => ro(prop),

  // refs
  ref,
  refs,
  slotted,

  render: (renderer: RenderFunction<E>) => renderer,
  // template helpers
  hy,

  // events
  emit,
  set: (property: keyof E, extractor?: (e: Event) => E[typeof property]) => set<E>(property, extractor),
  stop: <T = any>(handler: (host: E, e: CustomEvent<T>) => void) => stop(handler),
  prevent: <T = any>(handler: (host: E, e: CustomEvent<T>) => void) => prevent(handler),

  // transient host type to render and safe define
  define: (component: Component<E>): Component<E> | null => {
    if (!window.customElements.get(component.tag)) {
      return hy_define(component)
    } else {
      console.warn(`Custom Element '${component.tag}' already defined.`)
      return null
    }
  },
})

/**
 * Build and define a web component with helpers.
 * @param factory a function which returns a component definition.
 * @returns the defined component or null if the tag is already defined.
 */
export function build<E extends HTMLElement>(
  factory: (builder: ReturnType<typeof HybridBuilder<E>>) => Component<E>
): Component<E> | null {
  const builder = HybridBuilder<E>()
  const component = factory(builder)
  return builder.define(component)
}
