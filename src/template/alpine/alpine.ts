import { html, UpdateFunctionWithMethods } from 'hybrids'
import { ElementWithXAttributes, WalkerCallback } from './alpine-types.js'
import Alpine, { DirectiveCallback } from 'alpinejs'
import { xHost } from './x-host.js'
export let _Alpine

export function alpine<H>(string, ...parts): UpdateFunctionWithMethods<H> {
  if (!_Alpine) {
    throw new Error('Alpine.config must be called first.')
  }

  let fn = html<H>(string, ...parts)
  // assign Hybrids html helpers to the Alpine template engine fn
  return Object.assign(function (host: H & HTMLElement, target?: ShadowRoot | Text | H): void {
    fn(host, target)
    _Alpine.initTree(host.shadowRoot)
  }, fn)
}

alpine.engine = _Alpine?.version

/**
 * Configure the Alpine engine
 * @param inst An instance of the Alpine engine
 */
alpine.config = function (inst: typeof Alpine) {
  if (!!_Alpine) {
    console.warn('Alpine.config should only be called once.')
  }
  // register custom hybrids directives
  inst.directive('host', xHost(inst))
  _Alpine = inst

  alpine.engine = `alpinejs_${_Alpine?.version}`
}
