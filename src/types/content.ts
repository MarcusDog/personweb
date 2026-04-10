export type Language = 'zh' | 'en'

export type LocalizedText = Record<Language, string>

export interface ProjectSection {
  title: LocalizedText
  paragraphs: LocalizedText[]
}

export interface ProjectGalleryItem {
  label: LocalizedText
  description: LocalizedText
  image?: string
}

export interface ProjectShowcaseItem {
  image: string
  title: LocalizedText
  description: LocalizedText
}

export interface ProjectShowcaseGroup {
  afterSection: 'summary' | 'outcome' | number
  eyebrow?: LocalizedText
  title: LocalizedText
  description: LocalizedText
  layout?: 'single' | 'two-up' | 'feature-grid'
  items: ProjectShowcaseItem[]
}

export interface ProjectExternalLink {
  label: LocalizedText
  url: string
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
  showcaseGroups?: ProjectShowcaseGroup[]
  externalLinks?: ProjectExternalLink[]
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
