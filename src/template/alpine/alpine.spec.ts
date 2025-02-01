import { setup, tick } from '@src/test/index.js'
import Alpine from 'alpinejs'
import { beforeAll, describe, expect, test, vi } from 'vitest'
import { alpine } from './alpine.js'
import { define } from 'hybrids'

describe('alpine', () => {
  test('should throw error if Alpine is not initialized', () => {
    expect(() => alpine``).toThrowError('Alpine.config must be called first.')
  })

  describe('when Alpine is initialized', () => {
    beforeAll(() => {
      vi.spyOn(Alpine, 'initTree')
      alpine.config(Alpine)
    })

    test('should call Alpine.initTree', () => {
      const host = document.createElement('div')
      const target = document.createElement('div')
      alpine``(host, target)
      expect(Alpine.initTree).toHaveBeenCalledTimes(1)
    })

    test('warns if Alpine.config is called more than once', () => {
      vi.spyOn(console, 'warn')
      alpine.config(Alpine)
      expect(console.warn).toHaveBeenCalledWith('Alpine.config should only be called once.')
    })

    define<any>({
      tag: 'alpine-template',
      render: () => alpine`
        <section x-data="{ open: false }" :class="open ? '' : 'hidden'">
          <button @click="open = !open">Toggle</button>
          <div x-show="open">Hello</div>
        </section>
      `,
    })
    const tree = setup(`<alpine-template></alpine-template>`).tree

    test(
      'alpine attributes can be used',
      tree(async (el) => {
        const section = el.querySelector('section')
        const button = el.querySelector('button')
        expect(section.classList.contains('hidden')).toBe(true)

        button.click()
        await tick()
        expect(section.classList.contains('hidden')).toBe(false)
      })
    )
  })
})
