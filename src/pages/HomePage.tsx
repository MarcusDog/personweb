import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ContactPanel } from '../components/ContactPanel'
import { FeaturedProject } from '../components/FeaturedProject'
import { HomeScrollSection } from '../components/HomeScrollSection'
import { JournalListItem } from '../components/JournalListItem'
import { ProjectListRow } from '../components/ProjectListRow'
import { SectionHeading } from '../components/SectionHeading'
import { editorialMedia, showcaseImages } from '../data/media'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'
import { getJournalEntries, getProjects } from '../lib/content'

const serviceItems = [
  {
    title: { zh: 'AI Agent 系统设计与实现', en: 'AI Agent System Design' },
    description: {
      zh: '设计多个 AI agent 协同工作的系统，处理复杂的自动化任务链。关注系统的稳定性、可恢复性与真实使用场景下的实际可用性。',
      en: 'Designing multi-agent systems where AI components work together on complex automation chains — with real emphasis on reliability, recovery, and actual usability over demo appeal.',
    },
  },
  {
    title: { zh: '日常流程自动化', en: 'Workflow Automation' },
    description: {
      zh: '找出工作流中最机械、最耗时的部分，用 AI 把它们处理掉。目标是让工具在后台安静运行，用户感觉不到它的存在。',
      en: 'Identify the most mechanical, time-consuming parts of a workflow and build AI systems to handle them quietly in the background — so the tool disappears into the routine.',
    },
  },
  {
    title: { zh: '从想法到可用原型', en: 'Idea to Working Prototype' },
    description: {
      zh: '你描述想要什么，我来判断技术路径、评估可行性，然后用最快的方式做出一个真实运行的版本。验证优先，打磨在后。',
      en: 'Describe what you want. I assess the approach, evaluate feasibility, then build a real, running version as fast as possible. Validation first — polish comes after.',
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
      {/* ─── Hero ──────────────────────────────────────────── */}
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
                {language === 'zh'
                  ? 'AI 系统设计 / Agent 开发 / 自动化工具'
                  : 'AI Systems / Agent Development / Automation'}
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
                  ? '独立开发者，专注 AI Agent 系统设计与落地实现。让 AI 处理那些重复、机械、不值得人亲自做的部分——把时间还给真正有意义的事。'
                  : 'Independent developer focused on AI agent systems and real-world implementation. Letting AI handle the repetitive, mechanical parts — so the time that matters goes to what actually matters.'}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  className={`safe-touch inline-flex items-center gap-2 rounded-full border border-[rgba(226,199,145,0.4)] bg-[rgba(215,189,135,0.12)] px-6 py-4 text-sm text-[var(--home-text)] transition duration-[240ms] hover:bg-[rgba(215,189,135,0.2)] ${
                    isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'
                  }`}
                  to="/projects"
                >
                  {language === 'zh' ? '查看项目' : 'View projects'}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  className={`safe-touch inline-flex items-center gap-2 px-4 py-4 text-sm text-[rgba(242,231,212,0.8)] transition duration-[240ms] hover:text-[var(--home-text)] ${
                    isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'
                  }`}
                  to="/about"
                >
                  {language === 'zh' ? '了解我' : 'About me'}
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
                  alt=""
                  aria-hidden="true"
                  className="hero-visual-image"
                  fetchPriority="high"
                />
                <div className="hero-visual-orbit" />
                <div className="hero-visual-copy">
                  <p className={isChinese ? 'hero-visual-label hero-visual-label-zh' : 'hero-visual-label'}>
                    {language === 'zh' ? '从想法到真实运行的系统' : 'From idea to working system'}
                  </p>
                  <p className="hero-visual-caption">
                    {language === 'zh'
                      ? 'AI 处理枯燥的部分，人负责判断方向。一个人，一套工具，一个能跑起来的结果。'
                      : 'AI handles the tedious. I handle direction. One person, one toolchain, one result that actually runs.'}
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
                  {language === 'zh' ? '正在做的事' : 'Current work'}
                </p>
                <ul className="mt-6 space-y-6">
                  {[
                    {
                      zh: '多 Agent 协作系统的设计与稳定性优化',
                      en: 'Multi-agent collaboration systems — design and reliability',
                    },
                    {
                      zh: '把重复工作流交给 AI 自动处理的工具链',
                      en: 'Tool chains that hand repetitive workflows to AI',
                    },
                    {
                      zh: '你有 idea——我来评估、路径规划、然后做出来',
                      en: 'You bring the idea — I assess, plan the path, then build it',
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

        {/* ─── Selected Projects ─────────────────────────── */}
        <HomeScrollSection
          className="page-shell pt-14 pb-[4.5rem] md:pt-[4.5rem] md:pb-20"
          glowClassName="home-scroll-glow-warm"
          frameClassName="home-scroll-frame-stack"
        >
          <SectionHeading
            eyebrow={language === 'zh' ? '精选项目' : 'Selected Projects'}
            title={language === 'zh' ? '不只是做出来，还要能讲清楚。' : 'Built to work. Presented with precision.'}
            description={language === 'zh'
              ? '从 AI 资讯平台到学习工作室，每个项目都有完整的设计判断、系统实现与结果呈现。'
              : 'From AI intelligence platforms to learning studios — each project has a clear problem, a real system, and a result worth presenting.'}
          />
          <div className="mt-12">
            <FeaturedProject project={featured} language={language} />
          </div>

          {/* Secondary project screenshots strip */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { src: '/project-images/ainews/4.png', label: { zh: '趋势分析', en: 'Trend analysis' } },
              { src: '/project-images/ainews/7.png', label: { zh: '实时资讯流', en: 'Real-time feed' } },
              { src: '/project-images/learningbydoing/1.png', label: { zh: '学习工作台', en: 'Learning studio' } },
            ].map((img) => (
              <figure key={img.src} className="group overflow-hidden rounded-[1.4rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)]">
                <img
                  src={img.src}
                  alt={copyFor(language, img.label)}
                  className="w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <figcaption className={`px-3 py-2 text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.06em]' : 'text-xs uppercase tracking-[0.22em]'}`}>
                  {copyFor(language, img.label)}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-6">
            {secondary.map((project) => (
              <ProjectListRow key={project.slug} project={project} language={language} />
            ))}
          </div>
        </HomeScrollSection>

        {/* ─── Journal ───────────────────────────────────── */}
        <HomeScrollSection
          className="page-shell py-[4.5rem] md:py-20"
          glowClassName="home-scroll-glow-paper"
          frameClassName="home-scroll-frame-split-left"
        >
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:items-start">
            <div className="space-y-6">
              <SectionHeading
                eyebrow={language === 'zh' ? '写作' : 'Journal'}
                title={language === 'zh' ? '做了什么，想了什么，踩了什么坑。' : 'What I built, thought, and broke.'}
                description={language === 'zh'
                  ? '记录 AI 实验过程、工具观察与项目复盘。不追求完整——只求诚实和有用。'
                  : 'Notes on AI experiments, tool observations, and project post-mortems. Not polished — just honest and useful.'}
              />
              {/* Editorial image */}
              <figure className="editorial-figure editorial-figure-compact overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
                <img
                  src={editorialMedia.paper}
                  alt={language === 'zh' ? '记录与整理' : 'Research and notes'}
                  className="editorial-figure-image"
                  loading="lazy"
                />
                <figcaption className="editorial-figure-caption">
                  {language === 'zh'
                    ? '想法转瞬即逝。先记下来，整理是之后的事。'
                    : 'Ideas are fleeting. Write them down first. Organize later.'}
                </figcaption>
              </figure>
            </div>
            <div>
              {journal.map((entry) => (
                <JournalListItem key={entry.slug} entry={entry} language={language} />
              ))}
            </div>
          </div>
        </HomeScrollSection>

        {/* ─── Capabilities ──────────────────────────────── */}
        <HomeScrollSection
          className="page-shell py-[4.5rem] md:py-20"
          glowClassName="home-scroll-glow-bronze"
          frameClassName="home-scroll-frame-split-left"
        >
          <div className="grid gap-10 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:items-start">
            <div className="space-y-6">
              <SectionHeading
                eyebrow={language === 'zh' ? '能做什么' : 'Capabilities'}
                title={language === 'zh' ? '从想法到能用，一个人推进。' : 'From idea to usable. One person, full stack.'}
                description={language === 'zh'
                  ? '涵盖系统架构、AI 集成、前端实现与产品表达，适合需要快速验证和完整交付的项目。'
                  : 'Covers system architecture, AI integration, frontend implementation, and product presentation — suited for projects that need fast validation and complete delivery.'}
              />
              {/* Project screenshot as capability showcase */}
              <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
                <img
                  src="/project-images/ainews/7.png"
                  alt={language === 'zh' ? 'AI 资讯平台界面' : 'AI platform interface'}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="border-t border-[var(--border-subtle)] px-5 py-3 text-[var(--text-muted)] text-sm">
                  {language === 'zh'
                    ? 'Ainews — 实时 AI 资讯工作台，多源聚合 + 趋势分析'
                    : 'Ainews — Real-time AI intelligence workspace, multi-source + trend analysis'}
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
                <img
                  src={editorialMedia.warmInterior}
                  alt={language === 'zh' ? '专注工作环境' : 'Focused work environment'}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="border-t border-[var(--border-subtle)] px-5 py-3 text-[var(--text-muted)] text-sm">
                  {language === 'zh' ? '专注于真正值得人来做的决策' : 'Focus on decisions that genuinely need a human'}
                </figcaption>
              </figure>
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
        </HomeScrollSection>

        {/* ─── About ─────────────────────────────────────── */}
        <HomeScrollSection
          className="page-shell py-[4.5rem] md:py-20"
          glowClassName="home-scroll-glow-dark"
          frameClassName="home-scroll-frame-split-right home-scroll-frame-dark"
        >
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* Left: identity panel */}
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
                {language === 'zh' ? '独立开发者，深度 vibe coder。' : 'Independent developer. Deep vibe-coder.'}
              </h2>
              <p className={`mt-5 max-w-xl text-[rgba(242,231,212,0.82)] ${isChinese ? 'text-[1.02rem] leading-[1.9]' : 'text-base leading-8'}`}>
                {language === 'zh'
                  ? '专注 AI Agent 系统设计与落地。当 AI 处理重复和机械的部分时，真正需要人的判断就变得更清晰了——这是我工作的核心逻辑。'
                  : 'Focused on AI agent system design and real-world deployment. When AI handles the repetitive and mechanical, what actually needs human judgment becomes clearer — that\'s the core logic I work from.'}
              </p>
              <Link
                className={`safe-touch mt-8 inline-flex items-center gap-2 text-sm ${isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'}`}
                to="/about"
              >
                {language === 'zh' ? '了解更多' : 'Read more'}
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: project screenshot grid + info cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Project screenshots row */}
              <div className="project-shot-frame">
                <img
                  src={showcaseImages[0]}
                  alt={language === 'zh' ? 'Ainews 平台' : 'Ainews platform'}
                  className="project-shot-image"
                  loading="lazy"
                />
              </div>
              <div className="project-shot-frame">
                <img
                  src={showcaseImages[3]}
                  alt={language === 'zh' ? 'LearningByDoing Studio' : 'LearningByDoing Studio'}
                  className="project-shot-image"
                  loading="lazy"
                />
              </div>
              {/* Info cards row */}
              {[
                {
                  label: { zh: '工作方式', en: 'Working mode' },
                  body: {
                    zh: '快速提出想法，最短路径让它运转，在真实场景观察，然后决定深化还是放弃。失败成本低，迭代速度快。',
                    en: 'Fast hypothesis, shortest path to running, observe in real conditions, then deepen or abandon. Low failure cost, fast iteration.',
                  },
                },
                {
                  label: { zh: '长期关注', en: 'Long-term focus' },
                  body: {
                    zh: 'AI 如何真正服务于人的日常——不是替代，是替代那些不值得人来做的部分，把时间还给有价值的判断。',
                    en: 'How AI can genuinely serve daily life — replacing the parts that shouldn\'t require a human, returning time to judgment that actually matters.',
                  },
                },
                {
                  label: { zh: '合作方式', en: 'Collaboration' },
                  body: {
                    zh: '想法成型或不成型都可以来聊。你只需要有一个问题，或者一个让你烦恼了很久的重复工作。',
                    en: 'Doesn\'t matter how formed your idea is. Bring a problem, or that repetitive task that\'s been annoying you for months.',
                  },
                },
                {
                  label: { zh: '项目来源', en: 'Where projects start' },
                  body: {
                    zh: '自己的真实烦恼、朋友随口提到的需求，或者看到某个东西觉得"这应该可以用 AI 搞定"的瞬间。',
                    en: 'My own real frustrations, a friend\'s offhand remark, or that moment of "this should be automated" during someone\'s workflow.',
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
        </HomeScrollSection>

        {/* ─── Contact bridge ────────────────────────────── */}
        <HomeScrollSection
          className="page-shell pb-20 md:pb-28"
          glowClassName="home-scroll-glow-paper"
          frameClassName="home-scroll-frame-stack"
        >
          <ContactPanel language={language} />
        </HomeScrollSection>
      </div>
    </>
  )
}
