import type { Language, LocalizedText } from '../types/content'

export function copyFor(language: Language, value: LocalizedText) {
  return value[language]
}
