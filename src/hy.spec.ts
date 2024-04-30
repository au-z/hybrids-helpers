import { define, html } from 'hybrids'
import { hy } from './hy'
import { describe, test, expect } from 'vitest'
import { setup, tick } from './test'

describe('hy', () => {
  describe('if', () => {
    define<any>({
      tag: 'test-if',
      value: false,
      content: ({ value }) => hy.if(value, html`True`, html`False`),
    })

    const tree = setup(`<test-if></test-if>`).tree

    test(
      'renders based on the conditional',
      tree(async (el) => {
        expect(el.textContent).toBe('False')
        el.value = true
        await tick()
        expect(el.textContent).toBe('True')
      })
    )
  })

  describe('regex', () => {
    define<any>({
      tag: 'test-regex',
      regex: () => /(\d+)\/(\d+)/,
      value: 'a/b',
      content: ({ regex, value }) => hy.regex(regex, ([match, a, b]) => html`${a}/${b}`, html`No Match`)(value),
    })

    const tree = setup(`<test-regex></test-regex>`).tree

    test(
      'renders the regex match',
      tree(async (el) => {
        expect(el.textContent).toBe('No Match')
        el.value = '1/2'
        await tick()
        expect(el.textContent).toBe('1/2')
      })
    )
  })

  describe('map', () => {
    define<any>({
      tag: 'test-map',
      items: () => [65, 66, 67],
      content: ({ items }: { items: number[] }) => html`[${hy.map(items, (i) => html`${String.fromCharCode(i)}`)}]`,
    })

    const tree = setup(`<test-map></test-map>`).tree

    test(
      'renders the mapped items',
      tree(async (el) => {
        expect(el.textContent).toBe('[ABC]')
      })
    )
  })
})
