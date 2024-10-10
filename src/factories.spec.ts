import { define } from 'hybrids'
import { describe, expect, test } from 'vitest'
import { truthy } from './observe.js'
import { setup, tick } from './test/index.js'
import { ro } from './factories/ro.js'

describe('factories', () => {
  describe('truthy observer', () => {
    define<any>({
      tag: 'my-test',
      value: {
        value: 0,
        observe: truthy((host: any, val: number) => (host.division = 10 / val)),
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
        el.value = undefined // sets 0
        await tick()
        expect(el.value).toBe(0)
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
