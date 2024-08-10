import { Descriptor } from 'hybrids'

/**
 * Track the mouse position relative to the target element.
 * @param options mouse tracking options
 * @param options.target target element to track mouse position. defaults to the host element
 * @param options.clamp whether to clamp the mouse position to the target element's bounding box
 * @returns A Descriptor which tracks the mouse position relative to the target element
 */
export function mouse<E>({
  target,
  clamp,
}: {
  target?: HTMLElement
  clamp?: boolean
} = {}): Descriptor<E, { x: number; y: number }> {
  return {
    value: { x: 0, y: 0 },
    connect: (host: E & HTMLElement, key, invalidate) => {
      if (clamp == null) {
        clamp = true
      }
      if (target == null) {
        target = host
      }

      function track(e) {
        host[key] = relativePosition(host, e, clamp)
        invalidate()
      }

      target.addEventListener('mousemove', track)
      return () => {
        target.removeEventListener('mousemove', track)
      }
    },
  }
}

function relativePosition(h: HTMLElement, e: MouseEvent, clamp = false) {
  const bbox = h.getBoundingClientRect()
  let x = e.clientX - bbox.x
  let y = e.clientY - bbox.y
  if (clamp) {
    x = Math.floor(Math.max(0, Math.min(bbox.width, x)))
    y = Math.floor(Math.max(0, Math.min(bbox.height, y)))
  }
  return { x, y }
}
