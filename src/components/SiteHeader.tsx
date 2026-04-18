import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'
import { copyFor } from '../lib/copy'
import { cn } from '../lib/utils'
import { LanguageSwitch } from './LanguageSwitch'

const navItems = [
  { href: '/projects', label: { zh: '项目', en: 'Projects' } },
  { href: '/journal', label: { zh: 'Journal', en: 'Journal' } },
  { href: '/about', label: { zh: '关于', en: 'About' } },
  { href: '/contact', label: { zh: '联系', en: 'Contact' } },
]

export function SiteHeader() {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isChinese = language === 'zh'

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 py-4 md:px-8 md:py-6">
      <div
        className={cn(
          'pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border px-4 py-3 backdrop-blur-md md:px-6',
          isHome
            ? 'border-[rgba(214,183,120,0.18)] bg-[rgba(14,12,10,0.4)] text-[var(--home-text)]'
            : 'border-[var(--border-subtle)] bg-[rgba(248,244,235,0.78)] text-[var(--text-strong)]',
        )}
      >
        <Link
          to="/"
          className={cn(
            'safe-touch brand-ui inline-flex items-center text-current',
            isChinese ? 'text-[0.96rem] tracking-[0.04em]' : 'text-sm font-semibold',
          )}
        >
          小天Aya
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'safe-touch brand-ui inline-flex items-center transition duration-[240ms]',
                  isChinese
                    ? 'text-[0.92rem] tracking-[0.08em]'
                    : 'text-[0.78rem] font-semibold uppercase tracking-[0.12em]',
                  isActive ? 'text-current' : 'text-current opacity-70 hover:opacity-100',
                )
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
          className="safe-touch inline-flex items-center justify-center rounded-full border border-current/15 p-3 md:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'pointer-events-auto mx-auto mt-3 max-w-7xl rounded-[1.75rem] border p-4 backdrop-blur-xl md:hidden',
              isHome
                ? 'border-[rgba(214,183,120,0.18)] bg-[rgba(12,10,8,0.92)] text-[var(--home-text)]'
                : 'border-[var(--border-subtle)] bg-[rgba(248,244,235,0.95)] text-[var(--text-strong)]',
            )}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'safe-touch rounded-2xl px-4 py-3',
                    isChinese ? 'text-[0.98rem]' : 'text-sm font-semibold uppercase tracking-[0.12em]',
                  )}
                  onClick={() => setOpen(false)}
                >
                  {copyFor(language, item.label)}
                </NavLink>
              ))}
            </div>
            <div className="mt-4">
              <LanguageSwitch />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
