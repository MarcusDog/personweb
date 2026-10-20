import { Search } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'

import { JournalListItem } from '../components/JournalListItem'
import { PageHero } from '../components/PageHero'
import { useLanguage } from '../hooks/useLanguage'
import { useJournalEntries } from '../hooks/useJournal'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'

export function JournalPage() {
  const { language } = useLanguage()
  usePageTitle(
    language === 'zh'
      ? 'Journal | 小天Aya'
      : 'Journal | XiaoTian Aya',
  )
  const { entries, source } = useJournalEntries()
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
        copyFor(language, entry.standfirst).toLowerCase().includes(normalized) ||
        copyFor(language, entry.body).toLowerCase().includes(normalized) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(normalized))
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
        <div className="mb-5 flex items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <span>{language === 'zh' ? `共 ${entries.length} 篇公开文章` : `${entries.length} public entries`}</span>
          <span className="inline-flex items-center gap-2"><i className={`h-1.5 w-1.5 rounded-full ${source === 'live' ? 'bg-emerald-500' : 'bg-[var(--accent-soft)]'}`} />{language === 'zh' ? (source === 'live' ? '内容已实时同步' : '正在读取内容') : source === 'live' ? 'Live archive' : 'Loading archive'}</span>
        </div>
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
                aria-label={language === 'zh' ? '搜索文章' : 'Search journal entries'}
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
                  aria-pressed={category === item}
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
        {!filtered.length && (
          <div className="border-t border-[var(--border-subtle)] py-16 text-center text-sm text-[var(--text-muted)]">
            {language === 'zh' ? '没有找到匹配的文章，换个关键词试试。' : 'No matching entries. Try another search.'}
          </div>
        )}
      </section>
    </>
  )
}
