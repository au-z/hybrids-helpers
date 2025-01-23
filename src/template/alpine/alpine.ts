import Alpine, { DirectiveCallback } from 'alpinejs'
import { html, UpdateFunctionWithMethods } from 'hybrids'
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
alpine.host = xHost

/**
 * Configure the Alpine engine
 * @param inst An instance of the Alpine engine
 */
alpine.config = function (
  inst: typeof Alpine,
  directives: Record<string, DirectiveCallback> = {
    host: xHost,
  }
) {
  if (!!_Alpine) {
    console.warn('Alpine.config should only be called once.')
  }
  // register custom hybrids directives
  for (const [name, callback] of Object.entries(directives)) {
    inst.directive(name, callback)
  }
  _Alpine = inst

  alpine.engine = `alpinejs_${_Alpine?.version}`
}
