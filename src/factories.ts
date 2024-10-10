import { UpdateFunctionWithMethods } from 'hybrids'

export interface RenderElement<T> extends HTMLElement {
  render: UpdateFunctionWithMethods<T>
}
