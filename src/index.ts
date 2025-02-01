import {
  Component,
  Descriptor as Desc,
  Descriptor,
  define as hy_define,
  Property as Prop,
  RenderFunction,
  html,
} from 'hybrids'
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
import { _Alpine, alpine } from './template/alpine/alpine.js'
import { xhost } from './template/alpine/x-host.js'
type Connect<E, V = undefined> = Descriptor<E, V>['connect']

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
// rendering: Alpine
export * from './template/alpine/alpine.js'
export * from './template/alpine/x-host.js'

// templating
export * from './events.js'
export * from './template/hy.js'

// utils
export { propertyToDescriptor } from './utils.js'

/**
 * Create a type-curried builder for Hybrid components.
 * @category Define
 * @typeParam E - host element type
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
  reflect: <V = any>(prop: Prop<E, V>, bidirectional = false) => reflect<E, V>(prop, bidirectional),
  ro: <V = any>(prop: Prop<E, V>) => ro(prop),

  // refs
  ref: ref<E>,
  refs: refs<E>,
  slotted,

  render: (renderer: RenderFunction<E>) => renderer,
  shadow: (value: RenderFunction<E>) => ({ value, shadow: true }),
  alpine: _Alpine ? alpine<E> : <E>(el: E) => console.warn('alpine.config must be called first.'),
  html: _Alpine ? alpine<E> : html<E>,
  // Alpine bindings
  xhost: <V = any>(prop: Prop<E, V>) => xhost<E, V>(prop),
  // template helpers
  hy,

  // events
  emit,
  // template event handlers
  set: <Ev extends Event = Event>(property: keyof E, extractor?: (e: Ev) => E[typeof property]) =>
    set<E>(property, extractor),
  stop: <T = any>(handler: (host: E, e: CustomEvent<T>) => void) => stop(handler),
  prevent: <T = any>(handler: (host: E, e: CustomEvent<T>) => void) => prevent(handler),

  // transient host type to render and safe define
  define: safeDefine<E>,
  // transient host type to render and safe compile
  compile: hy_define.compile<E>,
})

function safeDefine<E extends HTMLElement>(component: Component<E>) {
  if (!window.customElements.get(component.tag)) {
    return hy_define(component)
  } else {
    console.warn(`Custom Element '${component.tag}' already defined.`)
    return null
  }
}

/**
 * Build and define a web component with helpers.
 * @function
 * @category Define
 * @param factory a function which returns a component definition.
 * @typeParam E - host element type
 * @returns the defined component or null if the tag is already defined.
 */
export function build<E extends HTMLElement>(
  factory: (
    builder: ReturnType<typeof HybridBuilder<E>> & {
      onconnect: (...connectors: Connect<E>[]) => void
      ondisconnect: (...disconnectors: Connect<E>[]) => void
    }
  ) => Component<E>
): Component<E> | null {
  const builder = HybridBuilder<E>()

  // orphan connect and disconnect callbacks
  const connectCallbacks = []
  const disconnectCallbacks = []
  const onconnect = (...connectors: Connect<E>[]) => connectCallbacks.push(...connectors)
  const ondisconnect = (...disconnectors: Connect<E>[]) => disconnectCallbacks.push(...disconnectors)

  const component = factory({ ...builder, onconnect, ondisconnect })
  if (connectCallbacks.length > 0 || disconnectCallbacks.length > 0) {
    component['__builder_connect__'] = {
      value: undefined,
      connect(host: E, key: string, invalidate) {
        const disconnectors = connectCallbacks.map((connector) => connector(host, key, invalidate))
        return () => {
          disconnectors.forEach((disconnect) => disconnect())
          disconnectCallbacks.forEach((disconnector) => disconnector(host, key, invalidate))
        }
      },
    }
  }
  return builder.define(component)
}

/**
 * Build and compile a web component with helpers.
 * The component is not defined in the custom elements registry.
 * To define the component you can run `customElements.define(tag, component)`.
 * @category Define
 * @param factory a function which returns a component definition.
 * @returns the defined comoonent or null if the tag is already defined.
 */
build.compile = <E extends HTMLElement>(factory: (builder: ReturnType<typeof HybridBuilder<E>>) => Component<E>) => {
  const builder = HybridBuilder<E>()
  const component = factory(builder)
  return builder.compile(component)
}
