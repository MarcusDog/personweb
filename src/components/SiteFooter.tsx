import { Link } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'

export function SiteFooter() {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-[rgba(17,17,17,0.07)] bg-[var(--bloom-bg)] px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p
            className="font-[family-name:var(--font-display)] font-[900] text-xl tracking-[-0.02em] text-[#111]"
          >
            小天Aya
          </p>
          <p className="max-w-sm text-sm leading-7 text-[rgba(17,17,17,0.4)] font-[family-name:var(--font-ui)]">
            {language === 'zh'
              ? '把重复的工作交给 AI，把判断和创造留给人。'
              : 'Turning repetitive work into AI systems, so humans keep the judgment and creativity.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-6 font-[family-name:var(--font-ui)] text-xs uppercase tracking-[0.14em] text-[rgba(17,17,17,0.32)]">
          <Link className="safe-touch transition hover:text-[#111]" to="/projects">Projects</Link>
          <Link className="safe-touch transition hover:text-[#111]" to="/journal">Journal</Link>
          <Link className="safe-touch transition hover:text-[#111]" to="/about">About</Link>
          <Link className="safe-touch transition hover:text-[#111]" to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
