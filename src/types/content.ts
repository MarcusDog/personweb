export type Language = 'zh' | 'en'

export type LocalizedText = Record<Language, string>

export interface ProjectSection {
  title: LocalizedText
  paragraphs: LocalizedText[]
}

export interface ProjectGalleryItem {
  label: LocalizedText
  description: LocalizedText
}

export interface ProjectEntry {
  slug: string
  featured?: boolean
  year: string
  category: LocalizedText
  title: LocalizedText
  subtitle: LocalizedText
  summary: LocalizedText
  role: LocalizedText
  capabilities: LocalizedText[]
  challenge: LocalizedText
  approach: LocalizedText
  outcome: LocalizedText
  nextStep: LocalizedText
  accent: string
  detailSections: ProjectSection[]
  gallery: ProjectGalleryItem[]
}

export interface JournalEntryFrontmatter {
  slug: string
  date: string
  categoryZh: string
  categoryEn: string
  titleZh: string
  titleEn: string
  standfirstZh: string
  standfirstEn: string
}

export interface MarkdownHeading {
  depth: number
  text: string
  id: string
}

export interface JournalEntry {
  slug: string
  date: string
  category: LocalizedText
  title: LocalizedText
  standfirst: LocalizedText
  body: LocalizedText
  headings: Record<Language, MarkdownHeading[]>
}
