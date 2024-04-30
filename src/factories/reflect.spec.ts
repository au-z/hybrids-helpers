import { describe, expect, test } from 'vitest'
import { define } from 'hybrids'
import { setup } from '../test'

describe('reflect', () => {
  define<any>({
    tag: 'test-reflect',
    foo: {
      get: (host) => host.getAttribute('foo'),
      set: (host, val) => host.setAttribute('foo', val),
    },
  })

  const tree = setup(`<test-reflect></test-reflect>`).tree

  test(
    'reflects attribute to property',
    tree((el) => {
      el.setAttribute('foo', 'bar')
      expect(el.foo).toBe('bar')
    })
  )

  test(
    'reflects property to attribute',
    tree((el) => {
      el.foo = 'baz'
      expect(el.getAttribute('foo')).toBe('baz')
    })
  )
})
