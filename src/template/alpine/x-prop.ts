/**
 * Pass data to components with the x-prop directive.
 * @category Alpine
 * @example <div x-data="{ foo: 'bar' }" x-prop="{foo}"></div> // div.foo = 'bar'
 * @example <div x-data="{ foo: 'bar' }" x-prop.foo="foo"></div> // div.foo = 'bar'
 */
export function xProp(el, { modifiers, expression }, { evaluateLater, effect }) {
  const evaluate = evaluateLater(expression)
  const [propertyName] = modifiers ?? []

  effect(() =>
    evaluate((result) => {
      if (propertyName == null && typeof result === 'object' && !Array.isArray(result)) {
        Object.entries(result).forEach(([key, value]) => {
          el[key] = value
        })
      } else {
        el[propertyName] = result
      }
    })
  )
}
