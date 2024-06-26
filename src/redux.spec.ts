import { define } from 'hybrids'
import { AnyAction, createStore, Store } from 'redux'
import { describe, it, expect, beforeAll } from 'vitest'
import { redux } from './redux'
import { setup } from './test'

describe('redux factories', () => {
  const { store } = testStore(
    { value: 'foobar' },
    {
      SET_VALUE: (state, value) => ({ ...state, value }),
    }
  )

  describe('redux', () => {
    beforeAll(() => {
      define<any>({
        tag: 'test-redux',
        value: redux(store, (host, state: { value: any }) => state.value),
      })
    })

    const tree = setup(`<test-redux></test-redux>`).tree

    it(
      'reflects the value in the store',
      tree((el) => {
        expect(el.value).toBe('foobar')
      })
    )

    it(
      'reflects the updated store value',
      tree((el) => {
        store.dispatch({ type: 'SET_VALUE', value: 'boom' })
        expect(el.value).toBe('boom')
      })
    )
  })
})

function testStore(defaultState = {}, reducers = {}) {
  reducers = {
    ...reducers,
  }

  const store: Store<{ value: any }, AnyAction> = createStore((state = defaultState, { type, value }) => {
    const reduce = reducers[type]
    return reduce ? reduce(state, value) : state
  })

  return { store }
}
