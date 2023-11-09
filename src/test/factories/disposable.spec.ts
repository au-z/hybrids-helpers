import { define } from 'hybrids'
import { beforeAll, describe, expect, test } from 'vitest'
import { setup } from '..'
import { disposable } from '../../factories/disposable'
import { Disposable } from '../../interfaces'

let disposed = false

class MyDisposable implements Disposable {
  id = 'MY DISPOSABLE'
  constructor(private host: HTMLElement, private key: string, private invalidate: () => void) {}
  dispose() {
    disposed = true
  }
}

describe('dispose', () => {
  beforeAll(() => {
    define<any>({
      tag: 'test-dispose',
      anything: 'foo',
      cls: disposable(MyDisposable),
      fn: disposable(() => ({
        dispose: () => {
          disposed = true
        },
      })),
    })
  })

  const tree = setup(`<test-dispose></test-dispose>`).tree

  test(
    'calls dispose on disconnect for class',
    tree(
      async (el) => {
        expect(el.cls).toBeInstanceOf(MyDisposable)
      },
      {
        afterDisconnect: (el) => {
          expect(disposed).toBe(true)
          disposed = false
        },
      }
    )
  )

  test(
    'calls dispose on disconnect for function',
    tree(
      (el) => {
        expect(el.fn).toBeTruthy()
      },
      {
        afterDisconnect: (el) => {
          expect(disposed).toBe(true)
          disposed = false
        },
      }
    )
  )
})
