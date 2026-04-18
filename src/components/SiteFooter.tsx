import { Link } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'

export function SiteFooter() {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="brand-display text-2xl text-[var(--text-strong)]">小天Aya</p>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-soft)]">
            {language === 'zh'
              ? '把重复的工作交给 AI，把判断和创造留给人。你有 idea，欢迎来聊。'
              : 'Turning repetitive work into AI systems, so humans can keep the judgment and creativity.'}
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
