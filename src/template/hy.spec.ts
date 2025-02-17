import { define, html } from 'hybrids'
import { hy } from './hy.js'
import { describe, test, expect } from 'vitest'
import { setup, tick } from '../test/index.js'
import { light } from '@auzmartist/hybrids-helpers'

describe('hy', () => {
  describe('if', () => {
    define<any>({
      tag: 'test-if',
      value: false,
      render: light(({ value }) => hy.if(value, html`True`, html`False`)),
    })

    const tree = setup(`<test-if></test-if>`).tree

    test(
      'renders based on the conditional',
      tree(async (el) => {
        expect(el.childNodes[0].textContent).toBe('False')
        el.value = true
        await tick()
        expect(el.childNodes[0].textContent).toBe('True')
      })
    )
  })

  describe('regex', () => {
    define<any>({
      tag: 'test-regex',
      regex: () => /(\d+)\/(\d+)/,
      value: 'a/b',
      render: light(({ regex, value }) => hy.regex(regex, ([match, a, b]) => html`${a}/${b}`, html`No Match`)(value)),
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
      render: light(({ items }) => html`[ ${hy.map(items, (i: number) => html`${String.fromCharCode(i)}`)} ]`),
    })

    const tree = setup(`<test-map></test-map>`).tree

    test(
      'renders the mapped items',
      tree(async (el) => {
        const text = Array.from(el.childNodes).map((c: any) => c.textContent).join('')
        expect(text).toBe('[ ABC ]')
      })
    )
  })
})
