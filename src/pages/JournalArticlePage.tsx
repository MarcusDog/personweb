import { Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { ReadingToc } from '../components/ReadingToc'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'
import { formatDate, getJournalEntry } from '../lib/content'
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
  const entry = getJournalEntry(slug ?? '')
  const [copied, setCopied] = useState(false)

  usePageTitle(
    entry
      ? `${copyFor(language, entry.title)} | 小天Aya｜BemsZzz`
      : language === 'zh'
        ? '文章不存在 | 小天Aya｜BemsZzz'
        : 'Article Not Found | XiaoTian Aya | BemsZzz',
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
        <div className="article-atmosphere mb-12">
          <div className="article-atmosphere-mark" />
          <div className="article-atmosphere-panel article-atmosphere-panel-primary">
            <span>{copyFor(language, entry.category)}</span>
          </div>
          <div className="article-atmosphere-panel article-atmosphere-panel-secondary">
            <span>{formatDate(entry.date, language)}</span>
          </div>
          <div className="article-atmosphere-line" />
        </div>
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_18rem]">
          <article className="reading-prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    id={makeHeadingId(getNodeText(props.children))}
                    className={`brand-display mt-16 text-[var(--text-strong)] ${
                      isChinese ? 'text-[2.4rem] leading-[1.1]' : 'text-4xl leading-tight'
                    }`}
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
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
      </section>
    </>
  )
}
