import { projects } from '../data/projects'
import type { JournalEntry, Language, ProjectEntry } from '../types/content'
import { extractMarkdownHeadings, parseBilingualMarkdown } from './markdown'

const journalFiles = import.meta.glob('../content/journal/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export function getProjects(): ProjectEntry[] {
  return [...projects]
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function getJournalEntries(): JournalEntry[] {
  return Object.values(journalFiles)
    .map((file) => {
      const parsed = parseBilingualMarkdown(file)
      const rawDate = parsed.frontmatter.date as string | Date
      return {
        slug: parsed.frontmatter.slug,
        date: rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : String(rawDate),
        category: {
          zh: parsed.frontmatter.categoryZh,
          en: parsed.frontmatter.categoryEn,
        },
        title: {
          zh: parsed.frontmatter.titleZh,
          en: parsed.frontmatter.titleEn,
        },
        standfirst: {
          zh: parsed.frontmatter.standfirstZh,
          en: parsed.frontmatter.standfirstEn,
        },
        body: {
          zh: parsed.zh,
          en: parsed.en,
        },
        headings: {
          zh: extractMarkdownHeadings(parsed.zh),
          en: extractMarkdownHeadings(parsed.en),
        },
        tags: [parsed.frontmatter.categoryZh, parsed.frontmatter.categoryEn],
      } satisfies JournalEntry
    })
    .toSorted((a, b) => b.date.localeCompare(a.date))
}

export function getJournalEntry(slug: string) {
  return getJournalEntries().find((entry) => entry.slug === slug)
}

export function formatDate(date: string, language: Language) {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed)
}
