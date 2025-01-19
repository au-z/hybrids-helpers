// borrowed from @types/alpinejs v3
export type Transitions = {
  enter: TransitionStages
  leave: TransitionStages
} & TransitionFromObject
export type TransitionStages = Partial<{
  start: string | TransitionFromHelpers
  during: string | TransitionFromHelpers
  end: string | TransitionFromHelpers
}>
export type TransitionFromHelpers = Partial<CSSStyleDeclaration>
export interface TransitionFromObject {
  in: (before: () => void, after?: () => void) => void
  out: (before: () => void, after?: () => void) => void
}
export interface Binding {
  expression: string
  extract: boolean
}

export type Bindings<T> = {
  [key in keyof T]: key extends `${'x-on:' | '@'}${infer K extends keyof HTMLElementEventMap}`
    ? string | ((e: HTMLElementEventMap[K]) => void)
    : string | ((...args: any[]) => void)
}
export interface GetterSetter<T> {
  get(): T
  set(value: T): void
}
export interface XAttributes {
  _x_virtualDirectives: Bindings<{}>
  _x_ids: Record<string, number>
  _x_effects: Set<() => void>
  _x_runEffects: () => void
  _x_dataStack: Array<Record<string, unknown>>
  _x_ignore: true
  _x_ignoreSelf: true
  _x_isShown: boolean
  _x_bindings: Record<string, unknown>
  _x_undoAddedClasses: () => void
  _x_undoAddedStyles: () => void
  _x_cleanups: MutationCallback[]
  _x_attributeCleanups: Record<string, Array<() => void>>
  _x_ignoreMutationObserver: boolean
  _x_teleportBack: ElementWithXAttributes
  _x_refs_proxy: Record<string, unknown>
  _x_refs: unknown
  _x_keyExpression: string
  _x_prevKeys: string[]
  _x_forScope: Record<string, unknown>
  _x_lookup: Record<string, ElementWithXAttributes>
  _x_currentIfEl: ElementWithXAttributes
  _x_undoIf: () => void
  _x_removeModelListeners: Record<string, () => void>
  _x_model: GetterSetter<unknown>
  _x_forceModelUpdate: (value: unknown) => void
  _x_forwardEvents: string[]
  _x_doHide: () => void
  _x_doShow: () => void
  _x_toggleAndCascadeWithTransitions: (
    el: ElementWithXAttributes,
    val: boolean,
    show: () => void,
    hide: () => void
  ) => void
  _x_teleport: ElementWithXAttributes
  _x_transition: Transitions
  _x_hidePromise: Promise<() => void>
  _x_transitioning: {
    beforeCancel: (fn: () => void) => void
    beforeCancels: Array<() => void>
    cancel: () => void
    finish: () => void
  }
  _x_hideChildren: ElementWithXAttributes[]
  _x_inlineBindings: Record<string, Binding>
}
export type withXAttributes<T extends Element> = T & Partial<XAttributes>
export type ElementWithXAttributes<T extends Element = HTMLElement> = withXAttributes<T>
export type WalkerCallback = (el: ElementWithXAttributes, skip: () => void) => void
