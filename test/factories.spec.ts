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
        dispose: () => void
      }

      define<any>({
        tag: 'test-disposable',
        disposable: disposable(FooBar),
      })
    })


    it('creates a disposable', () => {
      const dom = test(`<`)
      const desc = disposable(FooBar)
    })
  })
})
