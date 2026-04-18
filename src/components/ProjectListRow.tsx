import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { trackEvent } from '../lib/analytics'
import { copyFor } from '../lib/copy'
import type { Language, ProjectEntry } from '../types/content'

interface ProjectListRowProps {
  project: ProjectEntry
  language: Language
}

export function ProjectListRow({ project, language }: ProjectListRowProps) {
  const isChinese = language === 'zh'

  return (
    <article className="grid gap-4 border-t border-[var(--border-subtle)] py-6 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-8 md:py-8">
      <p
        className={`brand-ui text-[var(--text-muted)] ${
          isChinese
            ? 'text-[0.82rem] tracking-[0.08em]'
            : 'text-xs uppercase tracking-[0.12em]'
        }`}
      >
        {project.year} / {copyFor(language, project.category)}
      </p>
      <div>
        <h3 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2rem] leading-[1.14]' : 'text-3xl leading-tight'}`}>
          {copyFor(language, project.title)}
        </h3>
        <p className={`mt-3 max-w-2xl text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.88]' : 'text-base leading-7'}`}>
          {copyFor(language, project.summary)}
        </p>
        <p className={`mt-4 max-w-2xl rounded-xl border border-[var(--accent-soft)] bg-[var(--accent-wash)] px-4 py-3 text-[var(--text-strong)] ${isChinese ? 'text-[0.94rem] leading-7' : 'text-sm leading-6'}`}>
          {language === 'zh' ? '结果：' : 'Result: '}
          {copyFor(language, project.result)}
        </p>
      </div>
      <Link
        className={`safe-touch inline-flex items-center gap-2 text-sm text-[var(--text-strong)] ${
          isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.12em]'
        }`}
        to={`/projects/${project.slug}`}
        data-analytics-event="project_detail_click"
        onClick={() => trackEvent('project_detail_click', { slug: project.slug, placement: 'list' })}
      >
        <span>{language === 'zh' ? '详情' : 'Details'}</span>
        <ArrowUpRight size={16} />
      </Link>
    </article>
  )
}
