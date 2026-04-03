import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ContactPanel } from '../components/ContactPanel'
import { FeaturedProject } from '../components/FeaturedProject'
import { JournalListItem } from '../components/JournalListItem'
import { ProjectListRow } from '../components/ProjectListRow'
import { SectionHeading } from '../components/SectionHeading'
import { editorialMedia } from '../data/media'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'
import { getJournalEntries, getProjects } from '../lib/content'

const serviceItems = [
  {
    title: { zh: 'AI Agent 产品与工作流设计', en: 'AI agent product and workflow design' },
    description: {
      zh: '从问题拆解、输入边界到结果面板，定义一个 Agent 应该如何进入真实业务场景。',
      en: 'Define how an agent enters a real workflow, from problem framing and input boundaries to result surfaces.',
    },
  },
  {
    title: { zh: '内容与研究系统', en: 'Publishing and research systems' },
    description: {
      zh: '把研究、写作、索引与再利用连接起来，让内容成为持续运转的系统而不是散落的草稿。',
      en: 'Connect research, writing, indexing, and reuse so content behaves like a system instead of scattered drafts.',
    },
  },
  {
    title: { zh: '前端展示与合作界面', en: 'Frontend surfaces and collaboration entry points' },
    description: {
      zh: '为复杂结构建立更安静、更可信的前端界面与商务入口。',
      en: 'Create quieter, more credible frontend and business-facing surfaces for complex systems.',
    },
  },
]

export function HomePage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  usePageTitle(
    language === 'zh'
      ? '小天Aya｜BemsZzz'
      : 'XiaoTian Aya | BemsZzz',
  )
  const projects = getProjects()
  const featured = projects.find((item) => item.featured) ?? projects[0]
  const secondary = projects.filter((item) => item.slug !== featured.slug).slice(0, 3)
  const journal = getJournalEntries().slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden px-4 pt-28 pb-14 md:px-8 md:pt-32 md:pb-[4.5rem]">
        <div className="hero-veil absolute inset-0" />
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.04fr)_minmax(22rem,0.96fr)] xl:items-end">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 2.6 }}
            className="relative z-10 max-w-3xl pt-6 md:pt-10"
          >
            <p
              className={`brand-ui mb-5 text-[rgba(242,231,212,0.72)] ${
                isChinese
                  ? 'text-[0.82rem] tracking-[0.08em]'
                  : 'text-xs uppercase tracking-[0.34em]'
              }`}
            >
              {language === 'zh' ? 'AI Agent / 个人品牌 / 写作' : 'AI Agent / Brand Platform / Journal'}
            </p>
            <div
              aria-label="小天Aya｜BemsZzz"
              className="brand-mark text-[var(--home-text)]"
            >
              <div className="brand-mark-line">
                <span className="brand-mark-cjk">小天</span>
                <span className="brand-mark-roman">Aya</span>
              </div>
              <div className="brand-mark-line brand-mark-secondary">BemsZzz</div>
            </div>
            <p className={`mt-8 max-w-2xl text-[var(--home-soft)] ${isChinese ? 'text-[1.1rem] leading-[1.95] md:text-[1.24rem]' : 'text-lg leading-8 md:text-xl'}`}>
              {language === 'zh'
                ? '为真实产品、内容流程与合作场景构建可持续的 AI Agent 系统。'
                : 'Building durable AI agent systems for real products, publishing workflows, and collaboration contexts.'}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                className={`safe-touch inline-flex items-center gap-2 rounded-full border border-[rgba(226,199,145,0.4)] bg-[rgba(215,189,135,0.12)] px-6 py-4 text-sm text-[var(--home-text)] transition duration-[240ms] hover:bg-[rgba(215,189,135,0.18)] ${
                  isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'
                }`}
                to="/projects"
              >
                {language === 'zh' ? '查看项目' : 'Explore projects'}
                <ArrowRight size={16} />
              </Link>
              <Link
                className={`safe-touch inline-flex items-center gap-2 px-4 py-4 text-sm text-[rgba(242,231,212,0.8)] transition duration-[240ms] hover:text-[var(--home-text)] ${
                  isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'
                }`}
                to="/journal"
              >
                {language === 'zh' ? '阅读 Journal' : 'Read the journal'}
              </Link>
            </div>
          </motion.div>
            <div className="relative z-10 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 2.72 }}
                className="hero-visual-panel"
              >
                <img
                  src={editorialMedia.hero}
                  alt={language === 'zh' ? '深色流动质感主视觉' : 'Dark fluid editorial visual'}
                  className="hero-visual-image"
                  fetchPriority="high"
                />
                <div className="hero-visual-orbit" />
                <div className="hero-visual-copy">
                  <p className={isChinese ? 'hero-visual-label hero-visual-label-zh' : 'hero-visual-label'}>
                    {language === 'zh' ? '从研究记录到可用工作流' : 'From research notes to usable workflows'}
                  </p>
                  <p className="hero-visual-caption">
                    {language === 'zh'
                      ? '让复杂输入进入更清晰的 Agent 结构、界面与协作节奏。'
                      : 'Turn noisy inputs into clearer agent structures, surfaces, and collaboration rhythms.'}
                  </p>
                </div>
              </motion.div>
              <motion.aside
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 2.82 }}
                className="relative h-fit rounded-[2rem] border border-[rgba(214,183,120,0.18)] bg-[rgba(11,10,8,0.42)] p-7 backdrop-blur-xl"
              >
                <p
                  className={`brand-ui text-[rgba(242,231,212,0.62)] ${
                    isChinese
                      ? 'text-[0.82rem] tracking-[0.08em]'
                      : 'text-xs uppercase tracking-[0.28em]'
                  }`}
                >
                  {language === 'zh' ? '当前关注' : 'Current Focus'}
                </p>
                <ul className="mt-6 space-y-6">
                  {[
                    {
                      zh: 'Agent 工作流如何进入真实业务链路',
                      en: 'How agent workflows enter real business operations',
                    },
                    {
                      zh: '内容系统、研究过程与自动化之间的结构关系',
                      en: 'Structural links between publishing systems, research, and automation',
                    },
                    {
                      zh: '更安静但更可信的产品展示与合作界面',
                      en: 'Quieter but more credible product and partnership interfaces',
                    },
                  ].map((item) => (
                    <li key={item.en} className="border-t border-[rgba(214,183,120,0.12)] pt-5 first:border-t-0 first:pt-0">
                      <p className={`text-[var(--home-soft)] ${isChinese ? 'text-[1rem] leading-[1.9]' : 'text-base leading-7'}`}>
                        {copyFor(language, item)}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.aside>
            </div>
          </div>
        </div>
      </section>

      <div className="home-story-wrap">
        <section className="page-shell pt-14 pb-[4.5rem] md:pt-[4.5rem] md:pb-20">
          <SectionHeading
            eyebrow={language === 'zh' ? '精选项目' : 'Selected Projects'}
            title={language === 'zh' ? '将 AI Agent 做成真正可用的产品与工作流。' : 'Making AI agents usable inside real products and workflows.'}
            description={language === 'zh' ? '项目页强调产品定义、能力边界与最终结果，而不是把过程写成炫技清单。' : 'The work is framed around product definition, capability boundaries, and results, not technical spectacle.'}
          />
          <div className="mt-12">
            <FeaturedProject project={featured} language={language} />
          </div>
          <div className="mt-10">
            {secondary.map((project) => (
              <ProjectListRow key={project.slug} project={project} language={language} />
            ))}
          </div>
        </section>

        <section className="page-shell py-[4.5rem] md:py-20">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:items-start">
            <div className="space-y-6">
              <SectionHeading
                eyebrow={language === 'zh' ? '写作' : 'Journal'}
                title={language === 'zh' ? '把研究与判断力写下来，而不是只留下结果。' : 'Leaving behind written judgment, not just final output.'}
                description={language === 'zh' ? 'Journal 用来展开研究者与 AI 学习者视角，承接项目背后的方法、观察与长期问题。' : 'The journal holds the researcher lens behind the work: methods, observations, and longer-running questions.'}
              />
              <article className="paper-panel">
                <figure className="editorial-figure editorial-figure-compact">
                  <img
                    src={editorialMedia.architecture}
                    alt={language === 'zh' ? '浅色建筑光影与纸张感材质' : 'Architectural light and paper-like texture'}
                    className="editorial-figure-image"
                    loading="lazy"
                  />
                  <figcaption className="editorial-figure-caption">
                    {language === 'zh'
                      ? '把研究过程转换成可继续被调用的内容资产，而不是一次性输出。'
                      : 'Treat research as reusable content infrastructure instead of one-off output.'}
                  </figcaption>
                </figure>
              </article>
            </div>
            <div>
              {journal.map((entry) => (
                <JournalListItem key={entry.slug} entry={entry} language={language} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-[4.5rem] md:py-20">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:items-start">
            <div className="space-y-6">
              <SectionHeading
                eyebrow={language === 'zh' ? '能力结构' : 'Capabilities'}
                title={language === 'zh' ? '把研究、产品与前端表达放进同一条交付链。' : 'Putting research, product framing, and frontend expression inside one delivery chain.'}
                description={language === 'zh' ? '这里不是泛泛的技能罗列，而是我实际提供与项目直接相关的能力结构。' : 'This is not a generic skill list, but the capability structure I actually bring into project work.'}
              />
              <article className="paper-panel">
                <figure className="editorial-figure editorial-figure-compact editorial-figure-dark">
                  <img
                    src={editorialMedia.goldTexture}
                    alt={language === 'zh' ? '深色金属质感抽象图像' : 'Dark metallic abstract texture'}
                    className="editorial-figure-image"
                    loading="lazy"
                  />
                  <figcaption className="editorial-figure-caption">
                    {language === 'zh'
                      ? '把研究、流程、界面和对外表达放进同一条交付链。'
                      : 'A single delivery chain for research, workflow, interface, and outward-facing expression.'}
                  </figcaption>
                </figure>
              </article>
            </div>
            <div className="space-y-5">
              {serviceItems.map((item) => (
                <article key={item.title.en} className="paper-panel">
                  <h3 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.15rem] leading-[1.12]' : 'text-3xl leading-tight'}`}>
                    {copyFor(language, item.title)}
                  </h3>
                  <p className={`mt-4 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.9]' : 'text-base leading-8'}`}>
                    {copyFor(language, item.description)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-[4.5rem] md:py-20">
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="paper-panel home-about-panel text-[var(--home-text)]">
              <div className="home-identity-mark">
                <span>AYA</span>
              </div>
              <p
                className={`brand-ui text-[rgba(242,231,212,0.7)] ${
                  isChinese
                    ? 'text-[0.82rem] tracking-[0.08em]'
                    : 'text-xs uppercase tracking-[0.28em]'
                }`}
              >
                {language === 'zh' ? '关于' : 'About'}
              </p>
              <h2 className={`brand-display mt-5 ${isChinese ? 'text-[2.8rem] leading-[1.04] md:text-[4rem]' : 'text-4xl leading-[0.94] md:text-5xl'}`}>
                {language === 'zh' ? '研究者视角，产品化表达。' : 'A researcher lens, expressed through product work.'}
              </h2>
              <p className={`mt-5 max-w-xl text-[rgba(242,231,212,0.82)] ${isChinese ? 'text-[1.02rem] leading-[1.9]' : 'text-base leading-8'}`}>
                {language === 'zh'
                  ? '研究者与 AI 学习者身份是真实存在的，但我更关心如何把这种长期积累转成产品、流程和界面中的可靠判断。'
                  : 'The researcher and AI learner identity is real, but what matters more is how that long-term study becomes reliable judgment inside products, workflows, and interfaces.'}
              </p>
              <Link
                className={`safe-touch mt-8 inline-flex items-center gap-2 text-sm ${isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'}`}
                to="/about"
              >
                {language === 'zh' ? '进入 About' : 'Enter about'}
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <figure className="paper-panel editorial-figure editorial-figure-wide md:col-span-2">
                <img
                  src={editorialMedia.architecture}
                  alt={language === 'zh' ? '克制的建筑光影主视觉' : 'Minimal architectural visual'}
                  className="editorial-figure-image"
                  loading="lazy"
                />
              </figure>
              {[
                {
                  label: { zh: '研究方法', en: 'Research method' },
                  body: {
                    zh: '先定义边界，再讨论模型、界面与自动化的组合。',
                    en: 'Define the boundaries first, then decide how models, interfaces, and automation should combine.',
                  },
                },
                {
                  label: { zh: '长期关注', en: 'Long-term focus' },
                  body: {
                    zh: 'AI Agent 工作流、内容系统、知识结构与更安静的产品界面。',
                    en: 'AI agent workflows, publishing systems, knowledge structure, and calmer product surfaces.',
                  },
                },
                {
                  label: { zh: '工作方式', en: 'Working mode' },
                  body: {
                    zh: '研究、结构设计、前端实现与内容表达并行推进。',
                    en: 'Research, structural design, frontend implementation, and content expression move in parallel.',
                  },
                },
                {
                  label: { zh: '合作适配', en: 'Collaboration fit' },
                  body: {
                    zh: '适合需要从混乱输入走向清晰结构的产品与团队。',
                    en: 'Best suited for products and teams moving from noisy inputs toward clear structure.',
                  },
                },
              ].map((item) => (
                <article key={item.label.en} className="paper-panel">
                  <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
                    {copyFor(language, item.label)}
                  </p>
                  <p className={`mt-4 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.9]' : 'text-base leading-8'}`}>
                    {copyFor(language, item.body)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell pb-20 md:pb-28">
          <ContactPanel language={language} />
        </section>
      </div>
    </>
  )
}
