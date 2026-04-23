import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'
import { copyFor } from '../lib/copy'
import { LanguageSwitch } from './LanguageSwitch'

const navItems = [
  { href: '/projects', label: { zh: '项目', en: 'Projects' } },
  { href: '/journal', label: { zh: 'Journal', en: 'Journal' } },
  { href: '/about', label: { zh: '关于', en: 'About' } },
  { href: '/contact', label: { zh: '预约', en: 'Contact' } },
]

export function SiteHeader() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  const [open, setOpen] = useState(false)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-5 py-5 md:px-8 md:py-6">
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-4 border border-[rgba(17,17,17,0.07)] bg-[rgba(252,249,244,0.88)] px-5 py-3 backdrop-blur-md md:px-7">
        <Link
          to="/"
          className="safe-touch inline-flex items-center font-[family-name:var(--font-display)] font-[900] text-[0.92rem] tracking-[-0.01em] text-[#111]"
        >
          小天Aya
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  'safe-touch inline-flex items-center font-[family-name:var(--font-ui)] transition duration-[220ms]',
                  isChinese ? 'text-[0.88rem]' : 'text-[0.72rem] uppercase tracking-[0.14em]',
                  isActive
                    ? 'text-[#111]'
                    : 'text-[rgba(17,17,17,0.38)] hover:text-[rgba(17,17,17,0.8)]',
                ].join(' ')
              }
            >
              {copyFor(language, item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitch />
        </div>

        <button
          type="button"
          className="safe-touch inline-flex items-center justify-center border border-[rgba(17,17,17,0.1)] p-3 md:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mx-auto mt-2 max-w-6xl border border-[rgba(17,17,17,0.07)] bg-[rgba(252,249,244,0.96)] p-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={isChinese
                    ? 'safe-touch px-3 py-3 text-[0.98rem] text-[rgba(17,17,17,0.72)]'
                    : 'safe-touch px-3 py-3 text-xs uppercase tracking-[0.14em] font-[family-name:var(--font-ui)] text-[rgba(17,17,17,0.72)]'
                  }
                  onClick={() => setOpen(false)}
                >
                  {copyFor(language, item.label)}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 border-t border-[rgba(17,17,17,0.07)] pt-3">
              <LanguageSwitch />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
