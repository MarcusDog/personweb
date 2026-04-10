import { Link } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'

export function SiteFooter() {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="brand-display text-2xl text-[var(--text-strong)]">小天Aya｜BemsZzz</p>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-soft)]">
            {language === 'zh'
              ? '用 AI 做有意思的事，把无聊的留给机器。你有 idea，欢迎来找我聊。'
              : 'Building things with AI. Leaving the boring parts to the machine. Got an idea? Let\'s talk.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
          <Link className="safe-touch hover:text-[var(--text-strong)]" to="/projects">
            Projects
          </Link>
          <Link className="safe-touch hover:text-[var(--text-strong)]" to="/journal">
            Journal
          </Link>
          <Link className="safe-touch hover:text-[var(--text-strong)]" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}

