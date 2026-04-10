import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getInitialLanguage,
  LANGUAGE_STORAGE_KEY,
  setStoredLanguage,
} from '../lib/language'

describe('language preferences', () => {
  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('returns the stored language when present', () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'en')

    expect(getInitialLanguage()).toBe('en')
  })

  it('falls back to Chinese when the browser prefers zh and nothing is stored', () => {
    vi.stubGlobal('navigator', { language: 'zh-CN' })

    expect(getInitialLanguage()).toBe('zh')
  })

  it('persists explicit language changes', () => {
    setStoredLanguage('en')

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('en')
  })
})

