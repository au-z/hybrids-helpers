import { Descriptor, UpdateFunctionWithMethods } from 'hybrids'

export interface RenderElement<T> extends HTMLElement {
  render: UpdateFunctionWithMethods<T>
}

/**
 * An observer executing each passed observer in sequence
 * ```
 * define<MyElement>({
 *   color: {
 *     value: 'red',
 *     observe: forEach(
 *       cssVar('--my-element-color'),
 *       cssVar('--my-element-color-complement', (val, host) => complementaryColor(value)),
 *     ),
 *   },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param observers a list of 'observe' Descriptor functions to execute
 * @returns An 'observe' Descriptor function
 */
export const forEach =
  <E, V>(...observers: Descriptor<E, V>['observe'][]): NonNullable<Descriptor<E, V>['observe']> =>
  (host: E & HTMLElement, val: V, last: V) =>
    observers.forEach((observe) => observe(host, val, last))

/**
 * An observer which reflects the current property value to a custom CSS property on the host element.
 * ```
 * define<MyElement>({
 *   color: { value: 'red', observe: cssVar('--my-element-color') },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param customProperty CSS custom property name
 * @param transform am optional function converting the JS to CSS value
 * @returns An 'observe' Descriptor function
 */
export const cssVar =
  <E, V>(
    customProperty: string,
    transform: (val: V, host: E) => any = (val) => val
  ): NonNullable<Descriptor<E, V>['observe']> =>
  (host: E & HTMLElement, val: V) => {
    host.style.setProperty(customProperty, transform(val, host))
  }

/**
 * Runs the observe function only when the current value is non-nullish.
 * ```
 * define({
 *   property: {
 *     ...getset(undefined),
 *     observe: nnull(cssVar(--custom-property)),
 *   },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param observe 'observe' function to execute when the value is not null or undefined
 * @param nullCallback optional 'observe' function when the value is nullish
 * @returns an 'observe' Descriptor
 */
export function nnull<E, V>(
  observe: Descriptor<E, V>['observe'],
  nullCallback?: Descriptor<E, V>['observe']
): NonNullable<Descriptor<E, V>['observe']> {
  return (host: E & HTMLElement, value: V, last: V | undefined) => {
    if (value != null) {
      observe(host, value, last)
    } else {
      nullCallback?.(host, value, last)
    }
  }
}

/**
 * Runs the observe function only when the current value is truthy.
 * ```
 * define({
 *   property: {
 *     ...getset(''), // will not run on initial set
 *     observe: truthy(cssVar(--custom-property)),
 *   },
 * })
 * ```
 * @typeParam E - host element type
 * @typeParam V - property value type
 * @param observe 'observe' function to execute when the value is truthy
 * @param nullCallback optional 'observe' function when the value is falsy
 * @returns an 'observe' Descriptor
 */
export function truthy<E, V>(
  observe: Descriptor<E, V>['observe'],
  falsyCallback?: Descriptor<E, V>['observe']
): NonNullable<Descriptor<E, V>['observe']> {
  return (host: E & HTMLElement, value: V, last: V | undefined) => {
    if (value) {
      observe(host, value, last)
    } else {
      falsyCallback?.(host, value, last)
    }
  }
}
