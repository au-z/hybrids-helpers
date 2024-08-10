import { effect } from '@auzmartist/hybrids-helpers'
import { define } from 'hybrids'
import { describe, expect, test } from 'vitest'
import { setup, tick } from '../test'

describe('effect', () => {
  define<any>({
    tag: 'test-effect',
    foo: 'foo',
    counter: 0,
    // prettier-ignore
    effect: effect<any>(({ foo }) => foo, (host) => host.counter += 1),
  })

  const tree = setup(`<test-effect></test-effect>`).tree

  test(
    'calls effect function',
    tree(async (el) => {
      expect(el.counter).toBe(1)
      expect(el.effect).toBe('foo')
      el.foo = 'bar'
      expect(el.effect).toBe('bar')
      await tick()
      expect(el.counter).toBe(2)
    })
  )
})
