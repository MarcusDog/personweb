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
      ? 'Journal | 小天Aya｜BemsZzz'
      : 'Journal | XiaoTian Aya | BemsZzz',
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
        title={language === 'zh' ? '写作，是研究过程的一部分。' : 'Writing is part of the research process.'}
        description={language === 'zh' ? '这里保留方法笔记、系统观察、项目后记与 AI 学习过程中的结构化判断。' : 'This archive collects practice notes, system observations, project reflections, and structured judgment from ongoing AI study.'}
        aside={
          <div className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '支持分类筛选、站内搜索、文章目录与复制链接。' : 'Includes category filtering, local search, article outlines, and share links.'}</p>
            <p>{language === 'zh' ? `当前收录 ${entries.length} 篇文章样例。` : `${entries.length} article samples currently included.`}</p>
          </div>
        }
      />
      <section className="page-shell py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="safe-touch flex items-center gap-3 rounded-[1.4rem] border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-4">
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
      </section>
      <section className="page-shell pb-20 md:pb-28">
        {filtered.map((entry) => (
          <JournalListItem key={entry.slug} entry={entry} language={language} />
        ))}
      </section>
    </>
  )
}
