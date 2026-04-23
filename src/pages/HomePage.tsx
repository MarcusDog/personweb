import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { trackEvent } from '../lib/analytics'
import { copyFor } from '../lib/copy'
import { formatDate, getJournalEntries, getProjects } from '../lib/content'

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})

const inView = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' },
  transition: { duration: 0.85, ease: EASE },
}

const capabilities = [
  {
    title: { zh: 'AI Agent 系统设计与实现', en: 'AI Agent System Design' },
    description: {
      zh: '设计多个 AI agent 协同工作的系统，处理复杂的自动化任务链。关注系统的稳定性、可恢复性与真实使用场景下的实际可用性。',
      en: 'Multi-agent systems where AI components work together on complex automation chains — with real emphasis on reliability, recovery, and actual usability over demo appeal.',
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
  usePageTitle(isChinese ? '小天Aya' : 'XiaoTian Aya')

  const projects = getProjects()
  const journal = getJournalEntries().slice(0, 4)

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────────── */}
      <section className="bloom-hero">
        <div className="bloom-watermark" aria-hidden="true">天</div>

        <motion.div
          className="bloom-hero-content"
          initial={{ opacity: 0, filter: 'blur(18px)', scale: 0.97 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 1.5, ease: EASE }}
        >
          <motion.p
            className="bloom-eyebrow"
            {...fadeUp(0.1)}
          >
            {isChinese
              ? 'AI 系统设计 · Agent 开发 · 独立开发者'
              : 'AI Systems · Agent Development · Independent Developer'}
          </motion.p>

          <motion.h1
            className="bloom-h1"
            {...fadeUp(0.05)}
          >
            {isChinese
              ? <>把 AI 想法<br />做成可用系统</>
              : <>Turn AI ideas into<br />usable systems.</>}
          </motion.h1>

          <motion.div
            className="bloom-rule"
            {...fadeUp(0.2)}
          />

          <motion.p
            className="bloom-sub"
            {...fadeUp(0.28)}
          >
            {isChinese
              ? '面向独立开发者与小团队，提供 AI Agent 系统设计、自动化流程落地与从 0 到可用原型。真正改变日常生活的，是把现有工具连接成别人真正用得上的系统。'
              : 'For independent builders and small teams: AI agent system design, workflow automation, and zero-to-usable prototypes that connect tools into something people actually use.'}
          </motion.p>

          <motion.div
            className="bloom-ctas"
            {...fadeUp(0.4)}
          >
            <Link
              className="bloom-btn-fill safe-touch"
              to="/contact"
              data-analytics-event="hero_cta_click"
              onClick={() => trackEvent('hero_cta_click', { target: 'contact' })}
            >
              {isChinese ? '预约需求拆解' : 'Book a brief'}
            </Link>
            <Link
              className="bloom-btn-ghost safe-touch"
              to="/projects"
              data-analytics-event="hero_secondary_cta_click"
              onClick={() => trackEvent('hero_secondary_cta_click', { target: 'projects' })}
            >
              {isChinese ? '查看代表案例' : 'View case studies'}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <div className="page-shell">

        {/* ─── Projects ──────────────────────────────────────── */}
        <motion.section className="ma-section" {...inView}>
          <div className="ma-section-header">
            <div>
              <p className="ma-section-label">
                {isChinese ? '代表作品' : 'Selected Work'}
              </p>
              <h2 className="ma-section-title">
                {isChinese ? '不只是做出来，还要能讲清楚。' : 'Built to work. Presented with precision.'}
              </h2>
            </div>
            <Link className="ma-section-link safe-touch" to="/projects">
              {isChinese ? '全部项目' : 'All projects'} →
            </Link>
          </div>

          <div>
            {projects.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.72, ease: EASE, delay: i * 0.06 }}
              >
                <Link
                  to={`/projects/${project.slug}`}
                  className="ma-project-row block"
                  data-analytics-event="project_detail_click"
                  onClick={() => trackEvent('project_detail_click', { slug: project.slug, placement: 'home' })}
                >
                  <h3 className="ma-project-name">{copyFor(language, project.title)}</h3>
                  <div className="ma-project-meta">
                    <span className="ma-project-tag">
                      {project.year} / {copyFor(language, project.category)}
                    </span>
                    <div className="ma-project-dash" />
                    <span className="ma-project-arrow">
                      {isChinese ? '查看详情 →' : 'View →'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── Journal ───────────────────────────────────────── */}
        <motion.section className="ma-section" {...inView}>
          <div className="ma-section-header">
            <div>
              <p className="ma-section-label">
                {isChinese ? '写作' : 'Journal'}
              </p>
              <h2 className="ma-section-title">
                {isChinese ? '做了什么，想了什么，踩了什么坑。' : 'What I built, thought, and broke.'}
              </h2>
            </div>
            <Link className="ma-section-link safe-touch" to="/journal">
              {isChinese ? '全部文章' : 'All posts'} →
            </Link>
          </div>

          <div>
            {journal.map((entry, i) => (
              <motion.div
                key={entry.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.72, ease: EASE, delay: i * 0.07 }}
              >
                <Link
                  to={`/journal/${entry.slug}`}
                  className="bloom-entry"
                >
                  <div className="bloom-entry-date">
                    {formatDate(entry.date, language).split(' ').map((part, idx) => (
                      <span key={idx} style={{ display: 'block' }}>{part}</span>
                    ))}
                  </div>
                  <div>
                    <div className="bloom-entry-title">{copyFor(language, entry.title)}</div>
                    <div className="bloom-entry-desc">{copyFor(language, entry.standfirst)}</div>
                  </div>
                  <div className="bloom-entry-arrow">→</div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── About + Capabilities ──────────────────────────── */}
        <motion.section className="ma-about-section" {...inView}>
          <div className="ma-about-grid">
            {/* Identity */}
            <div>
              <div className="ma-about-mark" aria-hidden="true">AYA</div>
              <h2 className="ma-about-heading">
                {isChinese
                  ? '独立开发者，深度 vibe coder。'
                  : 'Independent developer. Deep vibe-coder.'}
              </h2>
              <p className="ma-about-body">
                {isChinese
                  ? '专注 AI Agent 系统设计与落地。当 AI 处理重复和机械的部分时，真正需要人的判断就变得更清晰了——这是我工作的核心逻辑。'
                  : 'Focused on AI agent system design and real-world deployment. When AI handles the repetitive and mechanical, what actually needs human judgment becomes clearer — that\'s the core logic I work from.'}
              </p>
              <Link className="ma-about-link safe-touch" to="/about">
                {isChinese ? '了解更多' : 'Read more'} <ArrowRight size={12} />
              </Link>
            </div>

            {/* Capabilities list */}
            <div>
              <p className="ma-section-label" style={{ marginBottom: '0' }}>
                {isChinese ? '能做什么' : 'Capabilities'}
              </p>
              {capabilities.map((item, i) => (
                <motion.div
                  key={item.title.en}
                  className="ma-capability-item"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                >
                  <p className="ma-capability-title">{copyFor(language, item.title)}</p>
                  <p className="ma-capability-desc">{copyFor(language, item.description)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── Contact ───────────────────────────────────────── */}
        <motion.section className="bloom-contact" {...inView}>
          <p className="bloom-contact-label">
            {isChinese ? '开始合作' : 'Get in touch'}
          </p>
          <h2 className="bloom-contact-heading">
            {isChinese ? '有个想法？\n一起拆解一下。' : 'Have an idea?\nLet\'s break it down.'}
          </h2>
          <p className="bloom-contact-sub">
            {isChinese
              ? '想法成型或不成型都可以来聊。你只需要有一个问题，或者一个让你烦恼了很久的重复工作。'
              : 'Doesn\'t matter how formed your idea is. Bring a problem, or that repetitive task that\'s been annoying you for months.'}
          </p>
          <div className="bloom-ctas">
            <Link
              className="bloom-btn-fill safe-touch"
              to="/contact"
              data-analytics-event="contact_cta_click"
              onClick={() => trackEvent('contact_cta_click', { placement: 'home_footer' })}
            >
              {isChinese ? '预约需求拆解' : 'Book a brief'}
            </Link>
          </div>
        </motion.section>

      </div>
    </>
  )
}
