import { RenderDescriptor, RenderFunction } from 'hybrids'

/**
 *
 * @param value the render function
 * @returns a rendder descriptor
 */
export function light<E extends HTMLElement = HTMLElement>(value: RenderFunction<E>): RenderDescriptor<E> {
  return {
    value,
    shadow: false,
  }
}
