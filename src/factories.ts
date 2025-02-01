import { UpdateFunctionWithMethods } from 'hybrids'

/**
 * A render element is an HTMLElement with a render method.
 */
export interface RenderElement<T> extends HTMLElement {
  render: UpdateFunctionWithMethods<T>
}
