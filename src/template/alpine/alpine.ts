import Alpine, { DirectiveCallback } from 'alpinejs'
import { html, UpdateFunctionWithMethods } from 'hybrids'
import { xHost } from './x-host.js'
import { xProp } from './x-prop.js'
export let _Alpine

/**
 * Render a Hybrids template powered by Alpine.
 * @category Alpine
 * @returns the html template function with the Alpine engine.
 *
 * @example ```
 * import {alpine} from '@auzmartist/hybrids-helpers'
 * alpine.config(Alpine)
 *
 * define({
 *   tag: 'my-component',
 *   render: alpine`
 *     <div x-data="{ open: false }" :class="open ? '' : 'hidden'">
 *       <button @click="open = !open">Toggle</button>
 *       <div x-show="open">Hello</div>
 *     </div>
 *   `,
 * })
 * ```
 */
export function alpine<H>(string, ...parts): UpdateFunctionWithMethods<H> {
  if (!_Alpine) {
    throw new Error('Alpine.config must be called first.')
  }

  const updateFn = html<H>(string, ...parts)

  return new Proxy(updateFn, {
    apply(target, thisArg, args: [H & HTMLElement, (ShadowRoot | Text | H)?]) {
      target.apply(thisArg, args)
      const [host] = args
      _Alpine.initTree(host.shadowRoot ?? host)
    },
  })
}

/**
 * Alpine engine version (alpinejs_x.x.x)
 * @category Alpine
 */
alpine.engine = _Alpine?.version

/**
 * apply Hybrids html helpers to the Alpine template engine
 */
alpine.resolve = html.resolve.bind(html)
alpine.set = html.set.bind(html)
alpine.transition = html.transition.bind(html)

/**
 * The special Alpine host directive for interop between Hybrids getters and Alpine data
 */
alpine.host = xHost
alpine.prop = xProp

/**
 * Configure the Alpine engine
 * @function
 * @category Alpine
 * @param Alp An instance of the Alpine engine
 * @param directives A record of custom Alpine directives to use with Hybrids. Default: {host: xHost, prop: xProp}
 *
 * @example ```
 *   import { alpine } from '@auzmartist/hybrids-helpers'
 *   alpine.config(Alpine)
 * ```
 */
alpine.config = function (
  Alp: typeof Alpine,
  directives: Record<string, DirectiveCallback> = {
    host: xHost,
    prop: xProp,
  }
) {
  if (!!_Alpine) {
    console.warn('Alpine.config should only be called once.')
  }
  // register custom hybrids directives
  for (const [name, callback] of Object.entries(directives)) {
    Alp.directive(name, callback)
  }
  _Alpine = Alp

  alpine.engine = `alpinejs_${_Alpine?.version}`
}
