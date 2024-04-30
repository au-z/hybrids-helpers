import { define } from 'hybrids'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { context } from './context.js'
import { setup, tick } from './test/index.js'

describe('context', () => {
  const [ctx, provide] = context<{ apiKey: string }>({
    apiKey: 'UNSET',
  })

  define({
    tag: 'context-provider',
    ...ctx,
  })

  define({
    tag: 'context-inheritor',
    ...provide<any, 'apiKey'>(({ apiKey }) => ({ apiKey })),
  })

  define({
    tag: 'context-inheritor-unsafe',
    ...provide<any, 'apiKey'>(({ apiKey }) => ({ apiKey }), true),
  })

  let spy
  beforeAll(() => {
    /* spy on console.error */
    spy = vi.spyOn(console, 'error')
  })

  let tree = setup(`
    <context-provider>
      <context-inheritor></context-inheritor>
    </context-provider>
  `).tree

  test(
    'provides context',
    tree(async (el) => {
      const inheritor = el.children[0]
      expect(el.apiKey).toBe('UNSET')
      expect(inheritor.apiKey).toBe('UNSET')

      el.apiKey = 'foobar'
      await tick()

      expect(inheritor.apiKey).toBe('foobar')
    })
  )

  tree = setup(`
    <context-provider></context-provider>
    <context-inheritor></context-inheritor>
  `).tree

  test(
    'cannot provide context if the inheritor is not a child',
    tree((el) => {
      expect(spy).toHaveBeenCalledTimes(1)
      spy.mockClear()
    })
  )

  tree = setup(`
    <context-provider></context-provider>
    <context-inheritor-unsafe></context-inheritor-unsafe>
  `).tree

  test(
    'can provide context if the inheritor is not a child',
    tree(async (el) => {
      // select the sibling
      const inheritor = el.parentNode.children[1]

      expect(spy).toHaveBeenCalledTimes(0)
      spy.mockClear()
      await tick()

      expect(inheritor.apiKey).toBe('UNSET')
    })
  )
})
