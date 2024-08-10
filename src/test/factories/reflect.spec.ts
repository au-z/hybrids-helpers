import { describe, expect, test } from 'vitest'
import { setup, tick } from '../index.js'
import { reflect } from '../../factories/reflect.js'
import { define } from 'hybrids'

interface H extends HTMLElement {
  foo: number
  getfoo: number
  reflectfoo: number
  bar: number
}

describe('reflect', () => {
  define<H>({
    tag: 'test-reflect',
    foo: 0,
    getfoo: (host) => host.foo,
    reflectfoo: reflect((host) => host.foo),
    bar: reflect((host) => host.foo, true),
  })

  const tree = setup(`<test-reflect></test-reflect>`).tree

  test(
    'reflected properties can be reset when the attribute changes',
    tree(async (el) => {
      el.foo = 42
      await tick()
      expect(el.bar).toBe(42)
      el.setAttribute('bar', '24')
    })
  )

  test(
    'getter property does not automatically reflect',
    tree(async (el) => {
      el.foo = 42
      await tick()
      expect(el.getAttribute('getfoo')).toBe(null)
    })
  )

  test(
    'reflects property to attribute',
    tree(async (el) => {
      el.foo = 42
      await tick()
      expect(el.getAttribute('reflectfoo')).toBe('42')
    })
  )

  test(
    'resets the reflected attribute when the property is unset',
    tree(async (el) => {
      el.foo = null
      expect(el.foo).toBe(0)
      await tick()
      expect(el.getAttribute('reflectfoo')).toBe('0')
    })
  )

  test(
    'resets the reflected attribute when property is set to undefined',
    tree(async (el) => {
      el.foo = undefined
      await tick()
      expect(el.getAttribute('reflectfoo')).toBe('0')
    })
  )
})
