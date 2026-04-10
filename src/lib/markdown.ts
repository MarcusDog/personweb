import type { JournalEntryFrontmatter, MarkdownHeading } from '../types/content'

export function parseBilingualMarkdown(source: string) {
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  const frontmatter = (frontmatterMatch?.[1] ?? '')
    .split('\n')
    .filter(Boolean)
    .reduce<Record<string, string>>((accumulator, line) => {
      const separatorIndex = line.indexOf(':')
      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()
      accumulator[key] = value
      return accumulator
    }, {})
  const content = frontmatterMatch?.[2] ?? source
  const [zhBlock = '', enBlock = ''] = content.split(/<!--lang:en-->/)
  const zh = zhBlock.replace(/<!--lang:zh-->/, '').trim()
  const en = enBlock.trim()

  return {
    frontmatter: frontmatter as unknown as JournalEntryFrontmatter,
    zh,
    en,
  }
}

export function makeHeadingId(text: string) {
  const normalized = text.trim().replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
  const englishStyle = normalized.toLowerCase().replace(/\s+/g, '-')
  return /[a-z0-9-]/.test(englishStyle) ? englishStyle : normalized
}

export function extractMarkdownHeadings(source: string): MarkdownHeading[] {
  return source
    .split('\n')
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      depth: match[1].length,
      text: match[2].trim(),
      id: makeHeadingId(match[2]),
    }))
}
