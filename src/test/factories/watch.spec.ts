import { describe, expect, test } from 'vitest'
import { watch } from '../../factories/watch'
import { define } from 'hybrids'
import { setup, tick } from '..'

describe('watch', () => {
  define<any>({
    tag: 'test-watch',
    foo: 'foo',
    counter: 0,
    // prettier-ignore
    watch: watch<any>(({ foo }) => foo, (host) => host.counter += 1),
  })

  const tree = setup(`<test-watch></test-watch>`).tree

  test(
    'calls watch function',
    tree(async (el) => {
      expect(el.counter).toBe(1)
      expect(el.watch).toBe('foo')
      el.foo = 'bar'
      expect(el.watch).toBe('bar')
      await tick()
      expect(el.counter).toBe(2)
    })
  )
})
