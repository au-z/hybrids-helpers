import { RenderDescriptor, RenderFunction } from 'hybrids'

/**
 * Create a render descriptor for a light DOM element.
 * @category Template
 * @param value the render function
 * @returns a rendder descriptor
 */
export function light<E extends HTMLElement = HTMLElement>(value: RenderFunction<E>): RenderDescriptor<E> {
  return {
    value,
    shadow: false,
  }
}
