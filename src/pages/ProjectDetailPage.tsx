import { Link, useParams } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { ProjectVisual } from '../components/ProjectVisual'
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

  return (
    <>
      <PageHero
        eyebrow={`${project.year} / ${copyFor(language, project.category)}`}
        title={copyFor(language, project.title)}
        description={copyFor(language, project.subtitle)}
        aside={
          <div className="space-y-6 text-sm leading-7 text-[var(--text-soft)]">
            <div>
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                {language === 'zh' ? '角色职责' : 'Role'}
              </p>
              <p className="mt-2">{copyFor(language, project.role)}</p>
            </div>
            <div>
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                {language === 'zh' ? '能力范围' : 'Capabilities'}
              </p>
              <ul className="mt-2 space-y-2">
                {project.capabilities.map((item) => (
                  <li key={item.en}>{copyFor(language, item)}</li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <section className="page-shell py-12 md:py-16">
        <div className="mb-12">
          <ProjectVisual project={project} language={language} />
        </div>
        <div className="grid gap-16 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.54fr)]">
          <article className="space-y-16">
            <div className="paper-panel">
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                {language === 'zh' ? '一句话定义' : 'One-line Summary'}
              </p>
              <p className={`mt-4 text-[var(--text-strong)] ${isChinese ? 'text-[1.4rem] leading-[1.72]' : 'text-xl leading-9'}`}>
                {copyFor(language, project.summary)}
              </p>
            </div>
            {project.detailSections.map((section) => (
              <section key={section.title.en}>
                <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.5rem] leading-[1.08]' : 'text-4xl leading-tight'}`}>
                  {copyFor(language, section.title)}
                </h2>
                <div className="mt-6 space-y-6 reading-copy">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.en}>{copyFor(language, paragraph)}</p>
                  ))}
                </div>
              </section>
            ))}
            <section>
              <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.5rem] leading-[1.08]' : 'text-4xl leading-tight'}`}>
                {language === 'zh' ? '最终结果' : 'Outcome'}
              </h2>
              <div className="mt-6 space-y-6 reading-copy">
                <p>{copyFor(language, project.outcome)}</p>
                <p>{copyFor(language, project.nextStep)}</p>
              </div>
            </section>
          </article>
          <aside className="space-y-6">
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
            <div className="paper-panel">
              <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
                {language === 'zh' ? '关键画面' : 'Key Frames'}
              </p>
              <div className="mt-4 space-y-4">
                {project.gallery.map((item) => (
                  <div key={item.label.en} className="rounded-[1.4rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-4">
                    <div className="mb-4">
                      <ProjectVisual project={project} language={language} compact />
                    </div>
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
          </aside>
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
