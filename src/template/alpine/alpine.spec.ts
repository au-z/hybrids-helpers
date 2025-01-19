import { describe, test, expect, beforeAll, vi } from 'vitest'
import { alpine } from './alpine.js'
import Alpine from 'alpinejs'
import { setup, tick } from '@src/test/index.js'
import { build } from '@src/index.js'

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
      expect(Alpine.initTree).toHaveBeenCalledWith(target)
    })

    test('warns if Alpine.config is called more than once', () => {
      vi.spyOn(console, 'warn')
      alpine.config(Alpine)
      expect(console.warn).toHaveBeenCalledWith('Alpine.config should only be called once.')
    })

    test('alpine attributes can be used', async () => {
      const host = document.createElement('div')
      const target = document.createElement('div')
      alpine`<div x-data="{ open: false }" :class="open ? '' : 'hidden'">
        <button @click="open = !open">Toggle</button>
        <div x-show="open">Hello</div>
      </div>`(host, target)

      const button = target.querySelector('button')
      const div = target.querySelector('div')
      expect(div.classList.contains('hidden')).toBe(true)

      button.click()
      await tick()
      expect(div.classList.contains('hidden')).toBe(false)
    })

    // const myEl = build(({ alpine }) => ({
    //   tag: 'my-el',
    //   render: () => alpine`<div x-data="{ open: false }" :class="open ? '' : 'hidden'">
    //     <button @click="open = !open">Toggle</button>
    //     <div x-show="open">Hello</div>
    //   </div>`,
    // }))
  })
})
