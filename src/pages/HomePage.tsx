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
    title: { zh: '独立全程，一个人跟到底', en: 'Solo, all the way through' },
    description: {
      zh: '设计、代码、部署、上线头一周，都是我一个人在盯。你不用对着三拨人重复讲同一件事，中间也不会换人。',
      en: 'Design, code, deploy, first week live — all me. You explain things once. No handoffs, no new person who missed the brief.',
    },
  },
  {
    title: { zh: '交付的是能用的，不是能看的', en: 'Delivered means working, not demo-ready' },
    description: {
      zh: '我不交 PPT，也不交设计图。交付那天你能打开、能录真实数据、能看到结果，第一版就算糙，也是真在跑的。',
      en: "No slides, no mockups. When I deliver, you open it, put real data in, and see output — rough is fine, as long as it actually runs.",
    },
  },
  {
    title: { zh: '两周以内，真实在跑', en: 'Two weeks to something real' },
    description: {
      zh: '两周不是答应把所有细节做完，是答应你能真用上。东西跑起来，才有得聊，哪儿该改、哪儿该加、哪儿其实没那么必要。',
      en: "Two weeks isn't perfect — it's usable. Once it's running, we have something real to talk about: what to change, what to add, what turns out not to matter.",
    },
  },
]

const testimonials = [
  {
    quote: {
      zh: '做的是 B2B 客户报价系统，找了三个外包都说只做某一层。小天把数据库、接口、前端、部署全包了，三周上线，上线后三个月没联系过他一次——不是联系不上，是根本没出过问题。',
      en: 'B2B quoting system. Three freelancers before him, each said they only did one layer. Tian took the whole thing — database, API, frontend, deployment. Three weeks to launch. Three months since then, I haven\'t had to contact him once.',
    },
    name: 'Kevin W.',
    role: { zh: '独立 SaaS 创始人', en: 'Independent SaaS Founder' },
  },
  {
    quote: {
      zh: '做的是文档总结和客服回复草稿自动化。以前每天下午有专人处理，现在全自动，每周省出来大概二十个人时。改动需求反馈当天就处理了。',
      en: 'Document summarization and customer reply drafts. We had someone doing it manually every afternoon — not anymore. Saves about twenty person-hours a week. Change requests turned around same day.',
    },
    name: '陈昊',
    role: { zh: '初创团队技术负责人', en: 'Tech Lead, Early-stage Startup' },
  },
  {
    quote: {
      zh: '批量整理视频脚本和关键词——以前要手动翻几十个文档，现在跑一下全出来了。每天两小时变成十分钟。用了一段时间后，我真的彻底忘了那个工具在跑。',
      en: 'Script organization and keyword tagging across dozens of files — all manual before. Now one run, everything done. Two hours down to ten minutes a day. After a while, I genuinely forgot the tool was running.',
    },
    name: '林晓雨',
    role: { zh: '内容创作者 / 10万+ 粉丝', en: 'Content Creator, 100k+ followers' },
  },
  {
    quote: {
      zh: '月报从人工整理三天压缩到两小时自动生成。改动反馈很快，晚上说、第二天早上就有新版本。上线后除了最开始的几个小问题，基本没再操心过。',
      en: 'Monthly reports went from three days of manual work to two hours of automated output. Fast on changes — flag something in the evening, updated version next morning. Minor issues at launch, nothing since.',
    },
    name: 'Mia L.',
    role: { zh: '运营负责人', en: 'Operations Lead' },
  },
]

const proofStats = [
  { num: '8+', label: { zh: '商业项目交付', en: 'Commercial projects' } },
  { num: '500+', label: { zh: '服务用户', en: 'Users served' } },
  { num: '≤2周', label: { zh: '平均交付周期', en: 'Avg. time to first build' } },
  { num: '99%', label: { zh: '好评率', en: 'Satisfaction rate' } },
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
          <motion.p className="bloom-eyebrow" {...fadeUp(0.1)}>
            {isChinese
              ? 'AI 自动化 · 独立全栈交付'
              : 'AI Automation · Solo Full-Stack Delivery'}
          </motion.p>

          <motion.h1 className="bloom-h1" {...fadeUp(0.05)}>
            {isChinese
              ? <>把 AI 想法<br />做成可用系统</>
              : <>Turn AI ideas into<br />usable systems.</>}
          </motion.h1>

          <motion.div className="bloom-rule" {...fadeUp(0.2)} />

          <motion.p className="bloom-sub" {...fadeUp(0.28)}>
            {isChinese
              ? '平时帮人做一件事，把那些每天重复、做好了没人夸、出错了才被想起来的活，接上 AI 让它自己跑。从界面到上线我都一个人盯着，大概两周，你就能看到真在跑的版本。'
              : 'I connect AI to the work that repeats daily, goes unnoticed when done, and only gets noticed when missed. Frontend to deployment, solo all the way — real running version in two weeks.'}
          </motion.p>

          <motion.div className="bloom-ctas" {...fadeUp(0.4)}>
            <Link
              className="bloom-btn-fill safe-touch"
              to="/contact"
              data-analytics-event="hero_cta_click"
              onClick={() => trackEvent('hero_cta_click', { target: 'contact' })}
            >
              {isChinese ? '来聊聊' : "Let's talk"}
            </Link>
            <Link
              className="bloom-btn-ghost safe-touch"
              to="/projects"
              data-analytics-event="hero_secondary_cta_click"
              onClick={() => trackEvent('hero_secondary_cta_click', { target: 'projects' })}
            >
              {isChinese ? '看看做了什么' : 'See the work'}
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
                {isChinese ? '做出来，也说得清为什么这么做。' : 'Built to run. Worth explaining too.'}
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
                {isChinese ? '做了什么，想了什么，在哪里摔过跤。' : 'What I built, thought about, and got wrong.'}
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
                <Link to={`/journal/${entry.slug}`} className="bloom-entry">
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

        {/* ─── Social Proof ──────────────────────────────────── */}
        <motion.section className="proof-section" {...inView}>
          <p className="proof-label">
            {isChinese ? '真实反馈' : 'What clients say'}
          </p>

          <div className="proof-stats">
            {proofStats.map((stat) => (
              <div key={stat.num} className="proof-stat">
                <span className="proof-stat-number">{stat.num}</span>
                <span className="proof-stat-label">{isChinese ? stat.label.zh : stat.label.en}</span>
              </div>
            ))}
          </div>

          <div className="proof-testimonials">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.name}
                className="proof-testimonial"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.06 }}
              >
                <span className="proof-testimonial-mark" aria-hidden="true">"</span>
                <p className="proof-testimonial-quote">{isChinese ? t.quote.zh : t.quote.en}</p>
                <footer>
                  <span className="proof-testimonial-name">{t.name}</span>
                  <span className="proof-testimonial-role">{isChinese ? t.role.zh : t.role.en}</span>
                </footer>
              </motion.blockquote>
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
                  ? '做 AI 的人，不喜欢有 AI 味的东西。'
                  : 'I build with AI. I can\'t stand things that feel like AI made them.'}
              </h2>
              <p className="ma-about-body">
                {isChinese
                  ? '我叫小天，独立开发者。AI 是我日常搭档，重复的活交给它，拿主意的留给我。我做东西也照这个理，用着顺、察觉不到背后在跑什么，那才是真做好了。'
                  : "I'm Tian — independent developer. AI is my main collaborator. Repetitive parts go to it, judgment stays with me. Same logic for what I build: if it feels smooth and you don't notice the machinery behind it, that's when it's actually done."}
              </p>
              <Link className="ma-about-link safe-touch" to="/about">
                {isChinese ? '了解更多' : 'Read more'} <ArrowRight size={12} />
              </Link>
            </div>

            {/* Capabilities list */}
            <div>
              <p className="ma-section-label" style={{ marginBottom: '0' }}>
                {isChinese ? '真正的差异在哪里' : 'What actually sets this apart'}
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
            {isChinese
              ? <><span>有个想法，或者</span><br /><span>有件事一直压着你？</span></>
              : <><span>Have an idea,</span><br /><span>or something that keeps weighing on you?</span></>}
          </h2>
          <p className="bloom-contact-sub">
            {isChinese
              ? '不用想清楚再来找我。一个模糊的念头就够，或者那件每天在重复、做好了没人夸的事，说出来就行。'
              : "No need to have it figured out. A vague feeling works, or just that task that repeats every day and nobody notices when done right. Say it."}
          </p>
          <div className="bloom-ctas">
            <Link
              className="bloom-btn-fill safe-touch"
              to="/contact"
              data-analytics-event="contact_cta_click"
              onClick={() => trackEvent('contact_cta_click', { placement: 'home_footer' })}
            >
              {isChinese ? '来聊聊' : 'Let\'s talk'}
            </Link>
          </div>
        </motion.section>

      </div>
    </>
  )
}
