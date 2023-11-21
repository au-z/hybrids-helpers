import { define } from 'hybrids'
import { describe, expect, it, test } from 'vitest'
import { getset, ro, truthy } from '../src'
import { protect } from '../src/factories/protect.js'
import { setup, tick } from '../src/test'

describe('factories', () => {
  describe.only('protect', () => {
    define<any>({
      tag: 'test-protect',
      foo: protect(getset('foo')),
    })

    const tree = setup(`<test-protect></test-protect>`).tree

    test(
      'protect',
      tree(async (el) => {
        expect(el.foo).toBe('foo')
        el.foo = 'bar'
        expect(el.foo).toBe('bar')
      })
    )
  })

  describe('getset', () => {
    it('returns a Descriptor', () => {
      const desc = getset('')
      expect(desc['get']).not.toBeUndefined
      expect(desc['set']).not.toBeUndefined
    })
  })

  describe('truthy observer', () => {
    define<any>({
      tag: 'my-test',
      value: {
        value: 0,
        observe: truthy((host: any, val) => (host.division = 10 / val)),
      },
      division: 1,
    })
    const tree = setup(`<my-test></my-test>`).tree

    test(
      'only divides by truthy values',
      tree(async (el) => {
        expect(el.value).toBe(0)
        expect(el.division).toBe(1)
        await tick()
        expect(el.division).toBe(1)
        el.value = 0.5
        await tick()
        expect(el.division).toBe(20)
        el.value = undefined // sets NaN
        await tick()
        expect(el.value).toBe(NaN)
        expect(el.division).toBe(20)
      })
    )
  })

  describe('ro', () => {
    define<any>({
      tag: 'my-bbox',
      bbox: ro<DOMRect>((host) => host.getBoundingClientRect()),
    })

    const tree = setup(`<my-bbox></my-bbox>`).tree
    test(
      'gets the bbox',
      tree(async (el) => {
        expect(el.bbox).toMatchObject({ width: 0, height: 0 })
      })
    )
  })
})
