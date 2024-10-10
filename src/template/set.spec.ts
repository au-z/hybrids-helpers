import { describe, test, expect } from 'vitest'
import { set } from './set.js'

describe('a set descriptor', () => {
  interface MyComponent extends HTMLElement {
    foo: string
  }

  test('creates a host[property] setter', () => {
    const host = { foo: 'bar' } as MyComponent

    const setter = set<MyComponent>('foo')
    const input = document.createElement('input')
    input.addEventListener('input', (e) => {
      setter(host, e)
      expect(host.foo).toBe('baz')
    })

    input.value = 'baz'
    input.dispatchEvent(new Event('input'))
  })
})
