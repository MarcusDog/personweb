import { Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'

import { JournalListItem } from '../components/JournalListItem'
import { PageHero } from '../components/PageHero'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'
import { getJournalEntries } from '../lib/content'

export function JournalPage() {
  const { language } = useLanguage()
  usePageTitle(
    language === 'zh'
      ? 'Journal | 小天Aya'
      : 'Journal | XiaoTian Aya',
  )
  const entries = getJournalEntries()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const deferredQuery = useDeferredValue(query)

  const categories = useMemo(
    () =>
      ['all', ...new Set(entries.map((entry) => copyFor(language, entry.category)))],
    [entries, language],
  )

  const filtered = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase()
    return entries.filter((entry) => {
      const categoryMatch =
        category === 'all' || copyFor(language, entry.category) === category
      const queryMatch =
        normalized.length === 0 ||
        copyFor(language, entry.title).toLowerCase().includes(normalized) ||
        copyFor(language, entry.standfirst).toLowerCase().includes(normalized)
      return categoryMatch && queryMatch
    })
  }, [category, deferredQuery, entries, language])

  return (
    <>
      <PageHero
        eyebrow="Journal"
        title={language === 'zh' ? '做了什么，想了什么，踩了什么坑。' : 'What I built, thought about, and got wrong.'}
        description={language === 'zh' ? 'AI 实验、工具的真实感受、项目做完之后回头看——还有那些做到一半突然想到的事。不追求完整，只要是真的。' : 'AI experiments, honest tool impressions, project retrospectives — and thoughts that surface mid-build. Not comprehensive. Just real.'}
        aside={
          <div className="text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '每篇都是真实做过的事，或者真实想过的问题。写完才放出来，不凑数。' : 'Every piece is about something I actually did or a question I genuinely wrestled with. No filler.'}</p>
          </div>
        }
      />
      <section className="page-shell py-8 md:py-10">
        <details
          className="rounded-[1.4rem] border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text-muted)]"
          data-journal-tools="secondary"
          open={entries.length >= 20}
        >
          <summary className="safe-touch cursor-pointer text-sm text-[var(--text-soft)]">
            {language === 'zh' ? '筛选与搜索' : 'Filter and search'}
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <label className="safe-touch flex items-center gap-3 rounded-[1.1rem] border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-3">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input
                className="w-full bg-transparent text-base text-[var(--text-strong)] outline-none placeholder:text-[var(--text-muted)]"
                type="search"
                placeholder={language === 'zh' ? '搜索标题或摘要' : 'Search title or standfirst'}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`safe-touch rounded-full border px-4 py-3 text-sm transition duration-[240ms] ${
                    category === item
                      ? 'border-[var(--accent-soft)] bg-[var(--accent-wash)] text-[var(--text-strong)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-strong)]'
                  }`}
                  onClick={() => setCategory(item)}
                >
                  {item === 'all' ? (language === 'zh' ? '全部' : 'All') : item}
                </button>
              ))}
            </div>
          </div>
        </details>
      </section>
      <section className="page-shell pb-20 md:pb-28">
        {filtered.map((entry) => (
          <JournalListItem key={entry.slug} entry={entry} language={language} />
        ))}
      </section>
    </>
  )
}
