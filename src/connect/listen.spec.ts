import { listen } from '@auzmartist/hybrids-helpers'
import { define } from 'hybrids'
import { describe, expect, test } from 'vitest'
import { setup, tick } from '../test/index.js'
import { connect } from './connect.js'

// prettier-ignore
describe('listen', () => {
  define<any>({
    tag: 'test-listen',
    count: 0,
    inc: (host) => () => host.count++,
    _: connect(listen((host: any) => ({
      inc: host.inc,
    }))),
  })

  const tree = setup(`<test-listen></test-listen>`).tree

  test(
    'listens for events',
    tree(async (el) => {
      el.dispatchEvent(new CustomEvent('inc'))
      await tick()
      expect(el.count).toBe(1)
    })
  )

  // test(
  //   'removes listener on disconnect',
  //   tree(
  //     async (el) => {
  //       el.dispatchEvent(new CustomEvent('inc'))
  //       await tick()
  //       expect(el.count).toBe(1)
  //     },
  //     {
  //       afterDisconnect(el) {
  //         el.dispatchEvent(new CustomEvent('inc'))
  //         expect(el.count).toBe(1)
  //       },
  //     }
  //   )
  // )
})
