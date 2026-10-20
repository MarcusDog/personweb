import { Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useParams } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { ReadingToc } from '../components/ReadingToc'
import { useLanguage } from '../hooks/useLanguage'
import { useJournalEntries } from '../hooks/useJournal'
import { usePageTitle } from '../hooks/usePageTitle'
import { trackEvent } from '../lib/analytics'
import { copyFor } from '../lib/copy'
import { formatDate } from '../lib/content'
import { makeHeadingId } from '../lib/markdown'

function getNodeText(children: ReactNode): string {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map((child) => getNodeText(child)).join('')
  if (children && typeof children === 'object' && 'props' in children) {
    const nodeWithProps = children as { props?: { children?: ReactNode } }
    return getNodeText(nodeWithProps.props?.children ?? '')
  }
  return ''
}

export function JournalArticlePage() {
  const { slug } = useParams()
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  const { entries } = useJournalEntries()
  const entry = entries.find((item) => item.slug === (slug ?? ''))
  const relatedEntries = entries
    .filter((item) => item.slug !== entry?.slug)
    .slice(0, 2)
  const [copied, setCopied] = useState(false)

  usePageTitle(
    entry
      ? `${copyFor(language, entry.title)} | 小天Aya`
      : language === 'zh'
        ? '文章不存在 | 小天Aya'
        : 'Article Not Found | XiaoTian Aya',
  )

  if (!entry) {
    return (
      <section className="page-shell pt-32 pb-20 md:pt-40">
        <h1 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[3rem] leading-[1.04]' : 'text-5xl'}`}>
          {language === 'zh' ? '文章不存在' : 'Article not found'}
        </h1>
      </section>
    )
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      <PageHero
        eyebrow={`${formatDate(entry.date, language)} / ${copyFor(language, entry.category)}`}
        title={copyFor(language, entry.title)}
        description={copyFor(language, entry.standfirst)}
        aside={
          <div className="space-y-4">
            <button
              type="button"
              className={`safe-touch inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-4 py-3 text-sm text-[var(--text-strong)] ${
                isChinese ? 'tracking-[0.06em]' : ''
              }`}
              onClick={handleCopyLink}
            >
              {copied ? <Check size={16} /> : <Link2 size={16} />}
              {language === 'zh' ? (copied ? '已复制链接' : '复制链接') : copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        }
      />

      <section className="page-shell pb-20 md:pb-28">
        {entry.coverImage ? (
          <figure className="mb-12 overflow-hidden rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-2 shadow-[var(--shadow-soft)]">
            <img className="max-h-[36rem] w-full rounded-[1.25rem] object-cover" src={entry.coverImage} alt="" />
          </figure>
        ) : <div className="article-atmosphere mb-12">
          <div className="article-atmosphere-mark" />
          <div className="article-atmosphere-panel article-atmosphere-panel-primary">
            <span>{copyFor(language, entry.category)}</span>
          </div>
          <div className="article-atmosphere-panel article-atmosphere-panel-secondary">
            <span>{formatDate(entry.date, language)}</span>
          </div>
          <div className="article-atmosphere-line" />
        </div>}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {entry.tags.map((tag) => <span key={tag} className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-muted)]">#{tag}</span>)}
          <span className="ml-auto text-xs text-[var(--text-muted)]">{isChinese ? `约 ${Math.max(1, Math.ceil(entry.body.zh.length / 450))} 分钟阅读` : `${Math.max(1, Math.ceil(entry.body.en.split(/\s+/).length / 220))} min read`}</span>
        </div>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="reading-prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ ...props }) => (
                  <h2
                    id={makeHeadingId(getNodeText(props.children))}
                    className={`brand-display mt-16 text-[var(--text-strong)] ${
                      isChinese ? 'text-[2.4rem] leading-[1.1]' : 'text-4xl leading-tight'
                    }`}
                    {...props}
                  />
                ),
                h3: ({ ...props }) => (
                  <h3
                    id={makeHeadingId(getNodeText(props.children))}
                    className={`brand-display mt-10 text-[var(--text-strong)] ${
                      isChinese ? 'text-[1.8rem] leading-[1.18]' : 'text-2xl leading-tight'
                    }`}
                    {...props}
                  />
                ),
              }}
            >
              {copyFor(language, entry.body)}
            </ReactMarkdown>
          </article>
          <ReadingToc headings={entry.headings[language]} language={language} />
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
          <section className="paper-panel">
            <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '需求拆解' : 'Architecture Review'}
            </p>
            <h2 className={`brand-display mt-4 text-[var(--text-strong)] ${isChinese ? 'text-[2.2rem] leading-[1.1]' : 'text-3xl leading-tight'}`}>
              {language === 'zh'
                ? '如果你在做类似系统，我可以帮你做一次架构评估。'
                : 'If you are building a similar system, I can review the architecture with you.'}
            </h2>
            <p className={`mt-4 text-[var(--text-soft)] ${isChinese ? 'text-[1rem] leading-[1.86]' : 'text-base leading-7'}`}>
              {language === 'zh'
                ? '把当前问题、想自动化的流程和预期交付发来，我会先判断边界、风险和最短可用路径。'
                : 'Send the current problem, workflow, and target delivery. I will assess boundaries, risks, and the shortest usable path.'}
            </p>
            <Link
              className="safe-touch mt-6 inline-flex rounded-xl bg-[var(--text-strong)] px-5 py-3 text-sm text-[var(--page-bg)]"
              to="/contact"
              data-analytics-event="article_cta_click"
              onClick={() => trackEvent('article_cta_click', { slug: entry.slug })}
            >
              {language === 'zh' ? '预约需求拆解' : 'Book a brief'}
            </Link>
          </section>
          <section className="paper-panel">
            <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '相关文章' : 'Related Articles'}
            </p>
            <div className="mt-4 space-y-4">
              {relatedEntries.map((item) => (
                <Link key={item.slug} className="safe-touch flex items-center border-t border-[var(--border-subtle)] pt-4 first:border-t-0 first:pt-0" to={`/journal/${item.slug}`}>
                  <p className={`text-[var(--text-strong)] ${isChinese ? 'text-[1rem] leading-7' : 'text-sm leading-6'}`}>
                    {copyFor(language, item.title)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  )
}
