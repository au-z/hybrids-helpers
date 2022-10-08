import { define } from 'hybrids'
import {describe, it, expect, beforeAll} from 'vitest'
import {disposable, Disposable, getset} from '../src'
import { test } from './utils'

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

    const tree = test(`<div>
      <test-disposable></test-disposable>
    </div>`)

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
})
