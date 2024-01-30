import {UpdateFunctionWithMethods, html} from 'hybrids'

export const hy = {
  if: <E>(condition: (boolean | (() => boolean)), frag: UpdateFunctionWithMethods<E>, fallback?: UpdateFunctionWithMethods<E>) => {
    return (typeof condition === 'function' ? condition() : condition) ? frag : fallback ? fallback : html``
  },
  regex: <E, R extends RegExp>(regexp: R, frag: (match: RegExpExecArray) => UpdateFunctionWithMethods<E>, fallback?: UpdateFunctionWithMethods<E>) => (value: string) => {
    const result = regexp.exec(value)
    return result?.[0] ? frag(result) : fallback ? fallback : html``
  },
  map: <E, T>(items: T[] | ((...args: any[]) => T[]), predicate: (item: T, i: number, arr: T[]) => UpdateFunctionWithMethods<E>) => {
    return (typeof items === 'function' ? items() : items).map(predicate)
  }
}