import { copyFor } from '../lib/copy'
import type { Language, MarkdownHeading } from '../types/content'

interface ReadingTocProps {
  headings: MarkdownHeading[]
  language: Language
}

export function ReadingToc({ headings, language }: ReadingTocProps) {
  if (headings.length === 0) return null
  const isChinese = language === 'zh'

  return (
    <aside className="paper-panel sticky top-28">
      <p className={`brand-ui mb-5 text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
        {copyFor(language, { zh: '目录', en: 'Outline' })}
      </p>
      <nav aria-label={language === 'zh' ? '目录' : 'Table of contents'}>
        <ol className="space-y-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                className={`-mx-2 flex min-h-11 items-center rounded-lg px-2 text-[var(--text-soft)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-strong)] ${isChinese ? 'text-[0.96rem] leading-[1.76]' : 'text-sm leading-6'}`}
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  )
}
