import { describe, expect, it } from 'vitest'

import { LIMITS, validateContact } from './validate'

const valid = {
  name: 'Jan Smit',
  email: 'jan@example.com',
  topic: 'work',
  message: 'We are hiring a Vue developer.',
}

describe('validateContact', () => {
  it('accepts a complete message and trims it', () => {
    const result = validateContact({ ...valid, name: '  Jan Smit  ' })
    expect(result).toEqual({ ok: true, data: valid })
  })

  it('reports every missing field', () => {
    const result = validateContact({})
    expect(result).toEqual({
      ok: false,
      errors: { name: 'required', email: 'required', topic: 'required', message: 'required' },
    })
  })

  it('treats whitespace and non-strings as missing', () => {
    const result = validateContact({ ...valid, name: '   ', message: 42 })
    expect(result.ok || result.errors).toEqual({ name: 'required', message: 'required' })
  })

  it('rejects an e-mail address without a domain', () => {
    const result = validateContact({ ...valid, email: 'jan@localhost' })
    expect(result.ok || result.errors).toEqual({ email: 'invalid' })
  })

  it('rejects unknown topics', () => {
    const result = validateContact({ ...valid, topic: 'spam' })
    expect(result.ok || result.errors).toEqual({ topic: 'invalid' })
  })

  it('rejects messages over the limit', () => {
    const result = validateContact({ ...valid, message: 'x'.repeat(LIMITS.message + 1) })
    expect(result.ok || result.errors).toEqual({ message: 'tooLong' })
  })
})
