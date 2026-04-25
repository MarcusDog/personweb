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
        title={language === 'zh' ? '代表作品和正在跑着的系统。' : 'Selected work and systems in production.'}
        description={language === 'zh' ? '做过才放进来。有完整案例的项目放前面，小工具和实验放在后面，不把所有东西都包装成"精选"。' : 'Only things I actually built. Bigger work with full case studies goes up front. Smaller tools and experiments sit in the archive — no pretending everything is curated.'}
        aside={
          <div className="text-sm leading-7 text-[var(--text-soft)]">
            <p>{language === 'zh' ? '做过的事才放进来。大项目有完整案例，小工具在下面归档，不伪装成"精选"。' : 'Only things I actually built. Bigger work gets full case studies; smaller tools go in the archive. No pretending everything is curated.'}</p>
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
