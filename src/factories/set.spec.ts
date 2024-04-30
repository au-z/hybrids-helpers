import { describe, expect, test } from 'vitest'
import { setup } from '../test'
import { set } from './set'
import { define } from 'hybrids'

describe('set', () => {
  define<any>({
    tag: 'test-set',
    foo: set((host, val = 'foo') => val.toUpperCase()),
  })

  const tree = setup(`<test-set></test-set>`).tree

  test(
    'calls set function',
    tree((el) => {
      el.foo = 'bar'
      expect(el.foo).toBe('BAR')
    })
  )

  test(
    'cannot be re-set via attribute',
    tree((el) => {
      expect(el.foo).toBe('FOO')
      // cannot be re-set via attribute
      el.setAttribute('foo', 'baz')
      expect(el.foo).toBe('FOO')
    })
  )
})
