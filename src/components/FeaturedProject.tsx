import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { projectMediaBySlug } from '../data/media'
import { copyFor } from '../lib/copy'
import type { Language, ProjectEntry } from '../types/content'

interface FeaturedProjectProps {
  project: ProjectEntry
  language: Language
}

export function FeaturedProject({ project, language }: FeaturedProjectProps) {
  const isChinese = language === 'zh'
  const image = projectMediaBySlug[project.slug]

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      className="group overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--surface-strong)] shadow-[var(--shadow-soft)]"
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
        <div className="relative min-h-[20rem] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(218,188,127,0.28),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(98,70,38,0.38),transparent_44%),linear-gradient(160deg,#17120d_0%,#0d0b09_100%)] p-8 md:min-h-[28rem] md:p-12">
          {image ? (
            <img
              src={image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-28 saturate-[0.72]"
              loading="lazy"
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(10,8,6,0.62),rgba(10,8,6,0.88))]" />
          <div className="ambient-orbit absolute inset-0 opacity-70" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(224,198,145,0.55),transparent)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div
              className={`brand-ui text-[rgba(245,236,220,0.72)] ${
                isChinese
                  ? 'text-[0.82rem] tracking-[0.08em]'
                  : 'text-xs uppercase tracking-[0.12em]'
              }`}
            >
              {project.year} / {copyFor(language, project.category)}
            </div>
            <div className="max-w-lg">
              <h3
                className={`brand-display balance text-[var(--home-text)] ${
                  isChinese
                    ? 'text-[2.8rem] leading-[1.02] md:text-[4.2rem]'
                    : 'text-4xl leading-[0.95] md:text-6xl'
                }`}
              >
                {copyFor(language, project.title)}
              </h3>
              <p className={`mt-4 max-w-md text-[var(--home-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.86]' : 'text-base leading-7'}`}>
                {copyFor(language, project.subtitle)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between p-8 md:p-12">
          <div>
            <p className={`text-[var(--text-soft)] ${isChinese ? 'text-[1.08rem] leading-[1.95]' : 'text-lg leading-8'}`}>
              {copyFor(language, project.summary)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.capabilities.map((capability) => (
                <span
                  key={capability.en}
                  className="rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm text-[var(--text-muted)]"
                >
                  {copyFor(language, capability)}
                </span>
              ))}
            </div>
          </div>
          <Link
            className={`safe-touch mt-10 inline-flex items-center gap-2 text-sm text-[var(--text-strong)] ${
              isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.12em]'
            }`}
            to={`/projects/${project.slug}`}
          >
            {language === 'zh' ? '查看项目' : 'View project'}
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
