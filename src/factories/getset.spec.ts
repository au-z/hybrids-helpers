import { describe, expect, test } from 'vitest'
import { setup } from '../test'
import { getset } from './getset'
import { define } from 'hybrids'

describe('getset', () => {
  define<any>({
    tag: 'test-getset',
    foo: getset('foo'),
  })

  const tree = setup(`<test-getset></test-getset>`).tree

  test(
    'calls get function',
    tree((tg) => {
      expect(tg.foo).toBe('foo')
    })
  )

  test(
    'calls set function',
    tree((tg) => {
      tg.foo = 'bar'
      expect(tg.foo).toBe('bar')
    })
  )
})
