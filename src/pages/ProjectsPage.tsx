import { FeaturedProject } from '../components/FeaturedProject'
import { PageHero } from '../components/PageHero'
import { ProjectListRow } from '../components/ProjectListRow'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { getProjects } from '../lib/content'

export function ProjectsPage() {
  const { language } = useLanguage()
  usePageTitle(
    language === 'zh'
      ? '项目 | 小天Aya'
      : 'Projects | XiaoTian Aya',
  )
  const projects = getProjects()
  const featured = projects.filter((item) => item.featured)
  const featuredSlugs = new Set(featured.map((item) => item.slug))
  const archive = projects.filter((item) => !featuredSlugs.has(item.slug))

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={language === 'zh' ? '代表作品和正在跑着的系统。' : 'Selected work and systems in production.'}
        description={language === 'zh' ? '做过才放进来。有完整案例的项目放前面，小工具和实验放在后面，不把所有东西都包装成"精选"。' : 'Only things I actually built. Bigger work with full case studies goes up front. Smaller tools and experiments sit in the archive — no pretending everything is curated.'}
        aside={
          <div className="text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '做过的事才放进来。大项目有完整案例，小工具在下面归档，不伪装成"精选"。' : 'Only things I actually built. Bigger work gets full case studies; smaller tools go in the archive. No pretending everything is curated.'}</p>
          </div>
        }
      />
      <section className="page-shell space-y-8 py-12 md:space-y-12 md:py-16">
        <div className="flex items-end justify-between gap-5 border-b border-[var(--border-subtle)] pb-5">
          <p className={`brand-ui text-[var(--text-muted)] ${language === 'zh' ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
            {language === 'zh' ? '重点项目 · 完整案例' : 'Selected work · Full case studies'}
          </p>
          <span className="text-xs text-[var(--text-muted)]">{String(featured.length).padStart(2, '0')}</span>
        </div>
        {featured.map((project) => (
          <FeaturedProject key={project.slug} project={project} language={language} />
        ))}
      </section>
      <section className="page-shell pb-20 md:pb-28">
        <div className="mb-6 flex items-end justify-between gap-5 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <p className={`brand-ui text-[var(--text-muted)] ${language === 'zh' ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '完整项目档案' : 'Complete project archive'}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
              {language === 'zh' ? '没有为了显得整齐而删掉小项目。每一项都写清楚它解决什么、做到哪里，以及还欠什么。' : 'Smaller projects stay visible. Each entry explains what it solves, what is real today, and what remains unfinished.'}
            </p>
          </div>
          <span className="text-xs text-[var(--text-muted)]">{String(archive.length).padStart(2, '0')}</span>
        </div>
        <div>
          {archive.map((project) => (
            <ProjectListRow key={project.slug} project={project} language={language} />
          ))}
        </div>
      </section>
    </>
  )
}
