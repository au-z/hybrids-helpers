import { define } from 'hybrids'
import { test } from 'vitest'
import {describe, it, expect, beforeAll} from 'vitest'
import {disposable, Disposable, getset, truthy} from '../src'
import { setup, tick } from './utils'

describe('factories', () => {
  describe('getset', () => {
    it('returns a Descriptor', () => {
      const desc = getset('')
      expect(desc['get']).not.toBeUndefined
      expect(desc['set']).not.toBeUndefined
    })
  })

  describe('disposable', () => {
    beforeAll(() => {
      class FooBar implements Disposable {
        dispose() {
          return 'disposed'
        }
      }

      function BarFoo() {
        return {
          dispose: () => 'disposed'
        }
      }

      define<any>({
        tag: 'test-disposable',
        disposableClass: disposable((host) => FooBar),
        disposableFunction: disposable((host) => BarFoo),
      })
    })

    const tree = setup(`<div>
      <test-disposable></test-disposable>
    </div>`).tree

    it('wraps a disposable class', tree((dom) => {
      const el = dom.children[0]
      expect(el.disposableClass.__proto__.constructor.name).toBe('FooBar')
      expect(el.disposableClass.dispose).toBeTypeOf('function')

      // replaces itself when removed from the DOM
      dom.removeChild(el);
      expect(el.disposableClass).toBe('disposed');
    }))

    it('wraps a disposable function', tree((dom) => {
      const el = dom.children[0]
      expect(typeof el.disposableFunction.__proto__.constructor).toBe('function')
      expect(el.disposableFunction.dispose).toBeTypeOf('function')

      // replaces itself when removed from the DOM
      dom.removeChild(el);
      expect(el.disposableFunction).toBe('disposed');
    }))
  })

  describe('truthy observer', () => {
    define<any>({
      tag: 'my-test',
      value: {
        value: 0,
        observe: truthy((host, val) => host.division = 10 / val)
      },
      division: 1,
    })
    const tree = setup(`<my-test></my-test>`).tree

    test('only divides by truthy values', tree(async (el) => {
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
    }))
  })
})
