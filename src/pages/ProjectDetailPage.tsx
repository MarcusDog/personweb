import { Link, useParams } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { ProjectVisual } from '../components/ProjectVisual'
import { projectMediaBySlug } from '../data/media'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'
import { getProject, getProjects } from '../lib/content'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  const project = getProject(slug ?? '')
  usePageTitle(
    project
      ? `${copyFor(language, project.title)} | 小天Aya｜BemsZzz`
      : language === 'zh'
        ? '项目不存在 | 小天Aya｜BemsZzz'
        : 'Project Not Found | XiaoTian Aya | BemsZzz',
  )
  const related = getProjects()
    .filter((entry) => entry.slug !== slug)
    .slice(0, 2)

  if (!project) {
    return (
      <section className="page-shell pt-32 pb-20 md:pt-40">
        <h1 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[3rem] leading-[1.04]' : 'text-5xl'}`}>
          {language === 'zh' ? '项目不存在' : 'Project not found'}
        </h1>
      </section>
    )
  }

  const projectHeroImage = projectMediaBySlug[project.slug]
  const showcaseGroups = project.showcaseGroups ?? []

  function renderShot(image: string, alt: string, featured?: boolean) {
    return (
      <div className={`project-shot-frame ${featured ? 'project-shot-frame-featured' : ''}`}>
        <img src={image} alt={alt} className="project-shot-image" loading="lazy" />
      </div>
    )
  }

  function renderShowcaseGroup(groupIndex: number) {
    const group = showcaseGroups[groupIndex]
    if (!group) return null

    const layout = group.layout ?? 'two-up'
    const items = group.items

    return (
      <section key={`${group.title.en}-${groupIndex}`} className="space-y-8">
        <div className="max-w-4xl space-y-4">
          {group.eyebrow ? (
            <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
              {copyFor(language, group.eyebrow)}
            </p>
          ) : null}
          <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.5rem] leading-[1.08]' : 'text-4xl leading-tight'}`}>
            {copyFor(language, group.title)}
          </h2>
          <p className={`max-w-3xl text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.88]' : 'text-base leading-8'}`}>
            {copyFor(language, group.description)}
          </p>
        </div>

        {layout === 'single' ? (
          <div className="space-y-8">
            {items.map((item) => (
              <article key={item.image} className="space-y-5">
                {renderShot(item.image, copyFor(language, item.title), true)}
                <div className="paper-panel max-w-3xl">
                  <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                    {copyFor(language, item.title)}
                  </p>
                  <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[1.82]' : 'text-sm leading-7'}`}>
                    {copyFor(language, item.description)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {layout === 'two-up' ? (
          <div className="grid gap-8 xl:grid-cols-2">
            {items.map((item) => (
              <article key={item.image} className="space-y-5">
                {renderShot(item.image, copyFor(language, item.title))}
                <div className="paper-panel">
                  <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                    {copyFor(language, item.title)}
                  </p>
                  <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[1.82]' : 'text-sm leading-7'}`}>
                    {copyFor(language, item.description)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {layout === 'feature-grid' ? (
          <div className="space-y-8">
            <article className="space-y-5">
              {renderShot(items[0].image, copyFor(language, items[0].title), true)}
              <div className="paper-panel max-w-3xl">
                <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                  {copyFor(language, items[0].title)}
                </p>
                <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[1.82]' : 'text-sm leading-7'}`}>
                  {copyFor(language, items[0].description)}
                </p>
              </div>
            </article>
            <div className="grid gap-8 xl:grid-cols-2">
              {items.slice(1).map((item) => (
                <article key={item.image} className="space-y-5">
                  {renderShot(item.image, copyFor(language, item.title))}
                  <div className="paper-panel">
                    <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                      {copyFor(language, item.title)}
                    </p>
                    <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[1.82]' : 'text-sm leading-7'}`}>
                      {copyFor(language, item.description)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <>
      <PageHero
        eyebrow={`${project.year} / ${copyFor(language, project.category)}`}
        title={copyFor(language, project.title)}
        description={copyFor(language, project.subtitle)}
      />

      {project.externalLinks && project.externalLinks.length > 0 && (
        <section className="page-shell pt-8 pb-4">
          <div className="flex flex-wrap gap-6">
            {project.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-10 py-5 text-[var(--text-on-accent)] shadow-lg shadow-[var(--accent)]/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[var(--accent)]/40"
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
                }}
              >
                <span className={`font-semibold ${isChinese ? 'text-2xl leading-relaxed' : 'text-2xl leading-relaxed'}`}>
                  {copyFor(language, link.label)}
                </span>
                <svg className="h-8 w-8 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="page-shell py-12 md:py-16">
        <div className="space-y-8">
          {projectHeroImage ? (
            renderShot(projectHeroImage, copyFor(language, project.title), true)
          ) : (
            <ProjectVisual project={project} language={language} />
          )}
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.24fr)_minmax(0,0.92fr)] xl:items-start">
            <div className="paper-panel">
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                {language === 'zh' ? '项目概述' : 'Project Summary'}
              </p>
              <p className={`mt-4 text-[var(--text-strong)] ${isChinese ? 'text-[1.36rem] leading-[1.78]' : 'text-xl leading-9'}`}>
                {copyFor(language, project.summary)}
              </p>
              <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
                <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                  {language === 'zh' ? '角色职责' : 'Role'}
                </p>
                <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[1rem] leading-[1.86]' : 'text-base leading-8'}`}>
                  {copyFor(language, project.role)}
                </p>
              </div>
              <div className="mt-8 border-t border-[var(--border-subtle)] pt-6">
                <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                  {language === 'zh' ? '能力范围' : 'Capabilities'}
                </p>
                <ul className="mt-4 flex flex-wrap gap-3">
                  {project.capabilities.map((item) => (
                    <li
                      key={item.en}
                      className={`rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-2 text-[var(--text-soft)] ${isChinese ? 'text-[0.92rem] leading-6' : 'text-sm leading-6'}`}
                    >
                      {copyFor(language, item)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-5">
              <div className="paper-panel">
                <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                  {language === 'zh' ? '关键问题' : 'Challenge'}
                </p>
                <p className={`mt-4 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.88]' : 'text-base leading-8'}`}>
                  {copyFor(language, project.challenge)}
                </p>
              </div>
              <div className="paper-panel">
                <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                  {language === 'zh' ? '方案结构' : 'Approach'}
                </p>
                <p className={`mt-4 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.88]' : 'text-base leading-8'}`}>
                  {copyFor(language, project.approach)}
                </p>
              </div>
            </div>
          </div>

          {showcaseGroups.length > 0 || project.gallery.length > 0 ? (
            <div className="paper-panel">
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                {language === 'zh' ? '案例结构' : 'Case Structure'}
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {showcaseGroups.length > 0
                  ? showcaseGroups.map((group) => (
                      <div key={group.title.en} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-4">
                        <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                          {group.eyebrow ? copyFor(language, group.eyebrow) : language === 'zh' ? '模块' : 'Section'}
                        </p>
                        <p className={`mt-3 text-[var(--text-strong)] ${isChinese ? 'text-[1rem] leading-[1.72]' : 'text-sm leading-6'}`}>
                          {copyFor(language, group.title)}
                        </p>
                      </div>
                    ))
                  : project.gallery.map((item) => (
                      <div key={item.label.en} className="rounded-[1.2rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-4">
                        <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                          {copyFor(language, item.label)}
                        </p>
                        <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[1.82]' : 'text-sm leading-7'}`}>
                          {copyFor(language, item.description)}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          ) : null}

          <article className="mt-16 space-y-20 md:mt-24">
            {showcaseGroups.map((group, index) => (group.afterSection === 'summary' ? renderShowcaseGroup(index) : null))}
            {project.detailSections.map((section, sectionIndex) => (
              <div key={section.title.en} className="space-y-10">
                <section className="grid gap-8 xl:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)]">
                  <div className="pt-1">
                    <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                      {language === 'zh' ? `章节 ${sectionIndex + 1}` : `Section ${sectionIndex + 1}`}
                    </p>
                  </div>
                  <div>
                    <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.45rem] leading-[1.08]' : 'text-4xl leading-tight'}`}>
                      {copyFor(language, section.title)}
                    </h2>
                    <div className="mt-6 space-y-6 reading-copy">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.en}>{copyFor(language, paragraph)}</p>
                      ))}
                    </div>
                  </div>
                </section>
                {showcaseGroups.map((group, index) => (group.afterSection === sectionIndex ? renderShowcaseGroup(index) : null))}
              </div>
            ))}

            <div className="space-y-10">
              <section className="grid gap-8 xl:grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)]">
                <div className="pt-1">
                  <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                    {language === 'zh' ? '收束' : 'Outcome'}
                  </p>
                </div>
                <div>
                  <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.45rem] leading-[1.08]' : 'text-4xl leading-tight'}`}>
                    {language === 'zh' ? '最终结果' : 'Outcome'}
                  </h2>
                  <div className="mt-6 space-y-6 reading-copy">
                    <p>{copyFor(language, project.outcome)}</p>
                    <p>{copyFor(language, project.nextStep)}</p>
                  </div>
                </div>
              </section>
              {showcaseGroups.map((group, index) => (group.afterSection === 'outcome' ? renderShowcaseGroup(index) : null))}
            </div>
          </article>
        </div>
      </section>

      <section className="page-shell pb-20 md:pb-28">
        <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
          {language === 'zh' ? '相关项目' : 'Related'}
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {related.map((entry) => (
            <Link
              key={entry.slug}
              to={`/projects/${entry.slug}`}
              className="paper-panel transition duration-[240ms] hover:-translate-y-0.5"
            >
              <div className="mb-5">
                <ProjectVisual project={entry} language={language} compact />
              </div>
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                {entry.year}
              </p>
              <h3 className={`brand-display mt-4 text-[var(--text-strong)] ${isChinese ? 'text-[2rem] leading-[1.14]' : 'text-3xl'}`}>
                {copyFor(language, entry.title)}
              </h3>
              <p className={`mt-3 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.86]' : 'text-base leading-7'}`}>
                {copyFor(language, entry.summary)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
