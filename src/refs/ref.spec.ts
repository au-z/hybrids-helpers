import { ref } from '@auzmartist/hybrids-helpers'
import { define, html } from 'hybrids'
import { describe, expect, test } from 'vitest'
import { setup } from '../test'

describe('ref', () => {
  define<any>({
    tag: 'test-ref',
    canvas: ref('canvas.container'),
    render: () => html`<canvas class="container"></canvas>`,
  })

  const tree = setup(`<test-ref></test-ref>`).tree

  test(
    'gets reference to element',
    tree((tg) => {
      expect(tg.canvas).toBeInstanceOf(HTMLCanvasElement)
    })
  )
})
