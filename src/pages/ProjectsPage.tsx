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
      ? '项目 | 小天Aya｜BemsZzz'
      : 'Projects | XiaoTian Aya | BemsZzz',
  )
  const projects = getProjects()
  const featured = projects.find((item) => item.featured) ?? projects[0]
  const archive = projects.filter((item) => item.slug !== featured.slug)

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={language === 'zh' ? '做过的东西，发出去的东西。' : 'Things I built. Things I shipped.'}
        description={language === 'zh' ? '从 AI 工具到自动化流程，做完就发，能用就行，然后继续迭代。' : 'From AI tools to automation workflows. Ship it, use it, keep iterating.'}
        aside={
          <div className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '重点关注：AI 产品、资讯与研究工具、内容系统，以及项目展示类前端。' : 'Focus areas: AI products, research and intelligence tools, publishing systems, and portfolio-facing frontend work.'}</p>
            <p>{language === 'zh' ? `当前收录 ${projects.length} 个项目样例。` : `${projects.length} project examples currently included.`}</p>
          </div>
        }
      />
      <section className="page-shell py-12 md:py-16">
        <FeaturedProject project={featured} language={language} />
      </section>
      <section className="page-shell pb-20 md:pb-28">
        <p className={`brand-ui mb-6 text-[var(--text-muted)] ${language === 'zh' ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.32em]'}`}>
          {language === 'zh' ? '项目归档' : 'Archive'}
        </p>
        <div>
          {archive.map((project) => (
            <ProjectListRow key={project.slug} project={project} language={language} />
          ))}
        </div>
      </section>
    </>
  )
}
