import { UpdateFunctionWithMethods, html } from 'hybrids'

/**
 * A collection of helpers for creating Hybrids templates.
 * @category Template
 */
export const hy = {
  print: (data: any, space?: string | number) => html`<pre>${JSON.stringify(data, null, space)}</pre>`,
  if: <E>(
    condition: boolean | (() => boolean),
    frag: UpdateFunctionWithMethods<E>,
    fallback?: UpdateFunctionWithMethods<E>
  ) => {
    return (typeof condition === 'function' ? condition() : condition) ? frag : fallback ? fallback : html``
  },
  // prettier-ignore
  regex: <E, R extends RegExp>(
    regexp: R,
    frag: (match: RegExpExecArray) => UpdateFunctionWithMethods<E>,
    fallback?: UpdateFunctionWithMethods<E>
  ) => (value: string) => {
    const result = regexp.exec(value)
    return result?.[0] ? frag(result) : fallback ? fallback : html``
  },
  map: <E, T>(
    items: T[] | ((...args: any[]) => T[]),
    predicate: (item: T, i: number, arr: T[]) => UpdateFunctionWithMethods<E>
  ) => {
    return (typeof items === 'function' ? items() : items).map(predicate)
  },
  case: <E, T extends number | string | symbol>(
    value: T,
    cases: Record<T, UpdateFunctionWithMethods<E>> & { default?: UpdateFunctionWithMethods<E> }
  ) => {
    return cases[value] ? cases[value] : cases.default ? cases.default : html``
  },
  keyvalue: <E>(record: Record<any, any>, template: (key: any, value: any) => UpdateFunctionWithMethods<E>) => {
    return Object.entries(record).map(([key, value]) => template(key, value))
  },
}
