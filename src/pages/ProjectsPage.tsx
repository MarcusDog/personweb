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
        title={language === 'zh' ? '以结果为导向的 AI Agent 项目展示。' : 'AI agent projects framed around outcomes.'}
        description={language === 'zh' ? '这里展示的不是技术清单，而是项目如何被定义、如何进入真实场景，以及最终留下了什么能力与结果。' : 'This archive focuses less on tool lists and more on how projects are framed, deployed into real contexts, and what outcomes they produce.'}
        aside={
          <div className="space-y-4 text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '重点关注：AI Agent 工作流、内容与研究系统、合作与业务入口。' : 'Focus areas: AI agent workflows, publishing and research systems, and business-facing interfaces.'}</p>
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
