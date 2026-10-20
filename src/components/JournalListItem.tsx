import { Link } from 'react-router-dom'

import { copyFor } from '../lib/copy'
import { formatDate } from '../lib/content'
import type { JournalEntry, Language } from '../types/content'

interface JournalListItemProps {
  entry: JournalEntry
  language: Language
}

export function JournalListItem({ entry, language }: JournalListItemProps) {
  const isChinese = language === 'zh'

  return (
    <article className="grid gap-4 border-t border-[var(--border-subtle)] py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8 md:py-8">
      <div className="space-y-2 text-sm text-[var(--text-muted)]">
        <p>{formatDate(entry.date, language)}</p>
        <p className={`brand-ui ${isChinese ? 'tracking-[0.06em]' : 'uppercase tracking-[0.12em]'}`}>
          {copyFor(language, entry.category)}
        </p>
      </div>
      <div>
        <Link to={`/journal/${entry.slug}`} className="group block">
          <h2
            className={`brand-display text-[var(--text-strong)] transition duration-[240ms] group-hover:text-[var(--accent-strong)] ${
              isChinese ? 'text-[2rem] leading-[1.14]' : 'text-3xl leading-tight'
            }`}
          >
            {copyFor(language, entry.title)}
          </h2>
          <p className={`mt-3 max-w-2xl text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.9]' : 'text-base leading-7'}`}>
            {copyFor(language, entry.standfirst)}
          </p>
        </Link>
      </div>
    </article>
  )
}
