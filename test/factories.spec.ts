import {describe, it, expect} from 'vitest'
import {getset} from '../src'

describe('factories', () => {
  describe('getset', () => {
    it('returns a Descriptor', () => {
      const desc = getset('')
      expect(desc['get']).not.toBeUndefined
      expect(desc['set']).not.toBeUndefined
    })
  })
})
