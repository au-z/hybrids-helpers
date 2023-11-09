import { Descriptor } from 'hybrids'

/**
 * Gets a reference to an element in the shadowDOM. This property cannot be used during render to prevent circular references.
 * ```
 * define({
 *   canvas: ref('canvas.container'),
 *   render: () => html`
 *     <canvas class="container"></canvas>
 *   `,
 * })
 * ```
 * @category Ref
 * @param query the querySelector query
 * @returns a reference to an element in the shadowDOM
 */
export const ref = <E, T extends Element = Element>(query: string): Descriptor<E, T> => ({
  get: ({ render }: E & HTMLElement & { render: () => ShadowRoot }) => render().querySelector(query),
})

/**
 * Gets all references to elements in the shadowDOM. This property cannot be used during render to prevent circular references.
 * ```
 * define({
 *  children: refs('div.child'),
 *  render: () => html`
 *    <div class="child"></div>
 *    <div class="child"></div>
 *  `,
 * })
 * ```
 * @category Ref
 * @param queryAll the querySelectorAll query
 * @returns references to all elements in the shadowDOM
 */
export const refs = <E, T extends Element = Element>(queryAll: string): Descriptor<E, T[]> => ({
  get: ({ render }: E & HTMLElement & { render: () => ShadowRoot }) => {
    const nodeList = render().querySelectorAll(queryAll)
    return Array.from(nodeList) as T[]
  },
})
