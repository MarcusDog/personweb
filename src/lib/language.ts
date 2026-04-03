import type { Language } from '../types/content'

export const LANGUAGE_STORAGE_KEY = 'personweb-language'

export function getInitialLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored === 'zh' || stored === 'en') {
    return stored
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function setStoredLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}
