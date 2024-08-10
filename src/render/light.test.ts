import { light } from '@auzmartist/hybrids-helpers'
import { html } from 'hybrids'
import { describe, expect, test } from 'vitest'

describe('light', () => {
  test('returns a render descriptor', () => {
    const desc = light(() => html``)
    expect(desc.value).not.toBeUndefined
    expect(desc.shadow).toBe(false)
  })
})
