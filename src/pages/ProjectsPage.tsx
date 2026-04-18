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
  const featured = projects.find((item) => item.featured) ?? projects[0]
  const archive = projects.filter((item) => item.slug !== featured.slug)

  return (
    <>
      <PageHero
        eyebrow="Projects"
        title={language === 'zh' ? '代表作品和正在成型的系统。' : 'Representative work and systems in progress.'}
        description={language === 'zh' ? '重点展示有完整案例结构的项目；较小的实验保留在归档里，不把全部项目伪装成“精选”。' : 'The page leads with deeper case studies and keeps smaller experiments in the archive instead of pretending everything is selected work.'}
        aside={
          <div className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '重点关注：AI 产品、研究工具、学习工作台、内容系统与自动化工作流。' : 'Focus areas: AI products, research tools, learning workspaces, content systems, and automation workflows.'}</p>
            <p>{language === 'zh' ? `当前收录 ${projects.length} 个项目样例。` : `${projects.length} project examples currently included.`}</p>
          </div>
        }
      />
      <section className="page-shell py-12 md:py-16">
        <FeaturedProject project={featured} language={language} />
      </section>
      <section className="page-shell pb-20 md:pb-28">
        <p className={`brand-ui mb-6 text-[var(--text-muted)] ${language === 'zh' ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
          {language === 'zh' ? '更多实验' : 'More Experiments'}
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
