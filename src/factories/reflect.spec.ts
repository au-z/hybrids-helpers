import { reflect } from '@auzmartist/hybrids-helpers'
import { define } from 'hybrids'
import { describe, expect, test } from 'vitest'
import { setup, tick } from '../test'

describe('reflect', () => {
  define<any>({
    tag: 'test-reflect',
    foo: reflect('foo', true),
  })

  const tree = setup(`<test-reflect></test-reflect>`).tree

  test(
    'reflects attribute to property',
    tree(async (el) => {
      el.setAttribute('foo', 'bar')
      await tick()
      expect(el.foo).toBe('bar')
    })
  )

  test(
    'reflects property to attribute',
    tree(async (el) => {
      el.foo = 'baz'
      await tick()
      expect(el.getAttribute('foo')).toBe('baz')
    })
  )
})
