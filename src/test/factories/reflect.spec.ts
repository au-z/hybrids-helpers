import { describe, expect, test } from 'vitest'
import { setup, tick } from '../index.js'
import { reflect } from '../../factories/reflect.js'
import { define } from 'hybrids'

interface H extends HTMLElement {
  foo: number
  foo2: number
  bar: number
  baz: number
}

describe('reflect', () => {
  define<H>({
    tag: 'test-reflect',
    foo: 0,
    foo2: (host) => host.foo,
    bar: reflect<H, number>((host: H) => host.foo),
    baz: reflect<H, number>((host: H) => host.foo, 'barbar'),
  })

  const tree = setup(`<test-reflect></test-reflect>`).tree

  test(
    'getter property does not automatically reflect',
    tree(async (el) => {
      el.foo = 42
      await tick()
      expect(el.getAttribute('foo2')).toBe(null)
    })
  )

  test(
    'reflects property to attribute',
    tree(async (el) => {
      el.foo = 42
      await tick()
      expect(el.getAttribute('bar')).toBe('42')
    })
  )

  test(
    'removes attribute when property is set to null',
    tree(async (el) => {
      el.foo = null
      await tick()
      expect(el.hasAttribute('bar')).toBe(false)
    })
  )

  test(
    'removes attribute when property is set to undefined',
    tree(async (el) => {
      el.foo = undefined
      await tick()
      expect(el.hasAttribute('bar')).toBe(false)
    })
  )

  test(
    'can reflect to a different attribute name',
    tree(async (el) => {
      el.foo = 42
      await tick()
      //
      expect(el.getAttribute('barbar')).toBe('42')
    })
  )
})
