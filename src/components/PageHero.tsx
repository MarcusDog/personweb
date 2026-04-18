import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import { useLanguage } from '../hooks/useLanguage'

interface PageHeroProps {
  eyebrow?: string
  title: string
  description: string
  aside?: ReactNode
}

export function PageHero({ eyebrow, title, description, aside }: PageHeroProps) {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  const shellClassName = aside
    ? 'grid gap-8 border-b border-[var(--border-subtle)] pb-10 md:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] md:gap-10 md:pb-14'
    : 'border-b border-[var(--border-subtle)] pb-10 md:pb-14'

  return (
    <section className="page-shell pt-28 md:pt-34">
      <div className={shellClassName}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={aside ? undefined : 'max-w-4xl'}
        >
          {eyebrow ? (
            <p
              className={`brand-ui mb-5 text-[var(--text-muted)] ${
                isChinese
                  ? 'text-[0.82rem] tracking-[0.08em]'
                  : 'text-sm font-semibold uppercase tracking-[0.12em]'
              }`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={`brand-display balance max-w-4xl text-[var(--text-strong)] ${
              isChinese
                ? 'text-[2.9rem] leading-[1.02] md:text-[5rem]'
                : 'text-5xl leading-[0.94] md:text-7xl'
            }`}
          >
            {title}
          </h1>
          <p
            className={`mt-6 max-w-2xl text-[var(--text-soft)] ${
              isChinese
                ? 'text-[1.08rem] leading-[1.95] md:text-[1.2rem]'
                : 'text-lg leading-8 md:text-xl'
            }`}
          >
            {description}
          </p>
        </motion.div>
        {aside ? (
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="paper-panel h-fit"
          >
            {aside}
          </motion.aside>
        ) : null}
      </div>
    </section>
  )
}
