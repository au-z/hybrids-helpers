import {define} from 'hybrids'
import {describe, it, expect} from 'vitest'
import { listen } from '../src'
import {test} from './utils'

describe('Hybrids connectors', () => {
	describe('listen', () => {
		define<any>({
			tag: 'test-listener',
			foo: 0,
			incrementFoo: (host) => (e) => host.foo++,
			bar: 0,
			incrementBar: (host) => (e) => host.bar++,
			_connect: {
				value: undefined,
				connect: listen((host: any) => ({
					'foo': host.incrementFoo,
					'bar': host.incrementBar,
				}))
			}
		})


		const tree = test(`<div>
			<test-listener></test-listener>
		<div>`)

		it('initializes event listener', tree((div) => {
			const el = div.children[0]
			expect(el.foo).toBe(0)
			expect(el.bar).toBe(0)
		}))

		it('responds to foo and bar events', tree((div) => {
			const el = div.children[0]
			el.dispatchEvent(new CustomEvent('foo'))
			el.dispatchEvent(new CustomEvent('foo'))
			el.dispatchEvent(new CustomEvent('bar'))
			expect(el.foo).toBe(2)
			expect(el.bar).toBe(1)
		}))

		it('unregisters on disconnect', tree((div) => {
			const el = div.children[0]
			let child
			el.dispatchEvent(new CustomEvent('foo'))
			expect(el.foo).toBe(1)
			while(child = div.lastElementChild) {
				div.removeChild(child)
			}
			el.dispatchEvent(new CustomEvent('foo'))
			expect(el.foo).toBe(1)
		}))
	})
})
