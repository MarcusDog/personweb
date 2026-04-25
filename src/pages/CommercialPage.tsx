import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { trackEvent } from '../lib/analytics'

const EASE = [0.22, 1, 0.36, 1] as const

const inView = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-8%' },
  transition: { duration: 0.85, ease: EASE },
}

const services = [
  {
    title: { zh: 'AI 系统定制', en: 'Custom AI Systems' },
    description: {
      zh: '你业务里有些事每天都要有人盯着——回复、整理、判断、通知。把这些接上 AI，让它自己跑。我来设计怎么接、接哪里、出了问题怎么恢复。',
      en: 'Parts of your business need a human watching every day — replies, sorting, decisions, alerts. Connect those to AI and let them run. I figure out where to plug in, how to wire it, and what happens when it breaks.',
    },
    tags: { zh: ['LLM 集成', '工作流设计', 'API 开发'], en: ['LLM Integration', 'Workflow Design', 'API Development'] },
  },
  {
    title: { zh: '工作流自动化', en: 'Workflow Automation' },
    description: {
      zh: '团队里总有一些事，每天有人在做，做了没人说谢谢，漏了才有人发现。找出这些事，把它们自动掉。比如每天向 33 个群发消息、每周整理一次月报、每小时抓一次竞品数据。',
      en: 'Every team has tasks that happen daily, nobody notices when done right, everyone notices when missed. Find those and automate them. Like sending content to 33 groups every day, generating weekly reports, or pulling competitor data every hour.',
    },
    tags: { zh: ['流程梳理', '定时任务', '数据处理'], en: ['Process Mapping', 'Scheduled Jobs', 'Data Processing'] },
  },
  {
    title: { zh: '快速原型验证', en: 'Rapid Prototype Validation' },
    description: {
      zh: '有个想法，不确定值不值得做。两周内我给你一个能真实跑的版本——能输入数据、能看结果——然后你再决定要不要继续。省掉那些"先做方案再做设计再做开发"的时间。',
      en: "You have an idea, not sure if it's worth it. Two weeks, I give you a version that actually runs — real inputs, real outputs — then you decide whether to keep going. Skip the plan-then-design-then-develop cycle.",
    },
    tags: { zh: ['快速交付', '真实测试', '迭代反馈'], en: ['Fast Delivery', 'Real-world Testing', 'Iteration Loop'] },
  },
]

const steps = [
  {
    num: '01',
    title: { zh: '先聊一次', en: 'One conversation' },
    description: {
      zh: '说清楚你想解决的问题，不需要准备技术文档。我来判断能不能做、值不值得做、该怎么做。',
      en: "Tell me what you want to solve. No brief needed. I'll figure out whether it's doable, worth doing, and how.",
    },
  },
  {
    num: '02',
    title: { zh: '定好范围', en: 'Scope it down' },
    description: {
      zh: '第一版做什么、不做什么，写清楚给你确认。确认了再开始，不会中途改方向。',
      en: "What version one does and what it doesn't — written down for you to confirm before anything starts. No mid-project pivots.",
    },
  },
  {
    num: '03',
    title: { zh: '两周出版本', en: 'Two weeks, real version' },
    description: {
      zh: '两周内你能看到真实跑着的版本——能点开，能输入真实数据，不是演示，不是 PPT。',
      en: 'Two weeks to something real — clickable, real data, not a mockup, not a slide.',
    },
  },
  {
    num: '04',
    title: { zh: '跟着上线', en: 'Stay through launch' },
    description: {
      zh: '上线后盯第一周，有问题当天处理。跑稳了再聊下一步。',
      en: 'Watch the first week live. Issues handled same day. Stable before we talk next steps.',
    },
  },
]

const stats = [
  { num: '8+', label: { zh: '商业项目交付', en: 'Commercial projects' } },
  { num: '500+', label: { zh: '服务用户', en: 'Users served' } },
  { num: '≤2周', label: { zh: '平均交付周期', en: 'Avg. time to first build' } },
  { num: '99%', label: { zh: '好评率', en: 'Satisfaction rate' } },
]

export function CommercialPage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  usePageTitle(isChinese ? '商业合作 | 小天Aya' : 'Commercial | XiaoTian Aya')

  return (
    <>
      <PageHero
        eyebrow={isChinese ? '商业合作' : 'Commercial'}
        title={isChinese ? '你有个问题，我来做出能跑的东西。' : 'You have a problem. I build something that runs.'}
        description={
          isChinese
            ? '一个人从头跟到尾——沟通、设计、开发、上线、上线后的第一周。不交概念图，不做半成品。'
            : "Solo from start to finish — scoping, building, shipping, watching the first week live. No concept decks. No handoffs at 80%."
        }
      />

      <div className="page-shell">

        {/* ─── Services ────────────────────────────────────────── */}
        <motion.section className="ma-section" {...inView}>
          <div className="ma-section-header">
            <div>
              <p className="ma-section-label">
                {isChinese ? '服务范围' : 'What I build'}
              </p>
              <h2 className="ma-section-title">
                {isChinese ? '三类事情，都做过，都有真实跑着的结果。' : 'Three kinds of work — all done before, all running in production.'}
              </h2>
            </div>
          </div>

          <div className="commercial-services">
            {services.map((service, i) => (
              <motion.div
                key={service.title.en}
                className="commercial-service"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.72, ease: EASE, delay: i * 0.08 }}
              >
                <p className="commercial-service-title">
                  {isChinese ? service.title.zh : service.title.en}
                </p>
                <p className="mt-3 text-sm leading-[1.9] text-[var(--bloom-soft)]">
                  {isChinese ? service.description.zh : service.description.en}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(isChinese ? service.tags.zh : service.tags.en).map((tag) => (
                    <span
                      key={tag}
                      className="border border-[var(--bloom-border)] px-2 py-0.5 font-[family-name:var(--font-ui)] text-[0.65rem] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.4)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── Process ─────────────────────────────────────────── */}
        <motion.section className="ma-section" {...inView}>
          <div className="ma-section-header">
            <div>
              <p className="ma-section-label">
                {isChinese ? '合作流程' : 'How it works'}
              </p>
              <h2 className="ma-section-title">
                {isChinese ? '就这四步，从第一次聊天到上线那天。' : 'Four steps, from the first conversation to launch day.'}
              </h2>
            </div>
          </div>

          <div className="commercial-process">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="commercial-step"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.68, ease: EASE, delay: i * 0.07 }}
              >
                <div className="commercial-step-num">{step.num}</div>
                <p className="mt-2 font-[family-name:var(--font-display)] font-[700] text-[1.05rem] text-[#111]">
                  {isChinese ? step.title.zh : step.title.en}
                </p>
                <p className="mt-2 text-sm leading-[1.85] text-[var(--bloom-soft)]">
                  {isChinese ? step.description.zh : step.description.en}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── Social Proof ────────────────────────────────────── */}
        <motion.section className="ma-section" {...inView}>
          <p className="ma-section-label">
            {isChinese ? '目前为止' : 'So far'}
          </p>
          <div className="proof-stats">
            {stats.map((stat) => (
              <div key={stat.num} className="proof-stat">
                <span className="proof-stat-number">{stat.num}</span>
                <span className="proof-stat-label">{isChinese ? stat.label.zh : stat.label.en}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Case Studies ──────────────────────────────────── */}
        <motion.section className="ma-section" {...inView}>
          <div className="ma-section-header">
            <div>
              <p className="ma-section-label">
                {isChinese ? '商业案例' : 'Case Studies'}
              </p>
              <h2 className="ma-section-title">
                {isChinese ? '做过的，能讲清楚的。' : 'Work I can show and explain.'}
              </h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* WeChat Auto */}
            <motion.div
              className="overflow-hidden rounded-[1.5rem] border border-[var(--bloom-border)] bg-[var(--bloom-bg)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.72, ease: EASE }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src="/project-images/wechatauto/1.png"
                  alt="WeChat Auto"
                  className="h-full w-full object-cover object-top transition duration-500 hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <p className="font-[family-name:var(--font-ui)] text-[0.65rem] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.4)]">
                  {isChinese ? '微信群自动化 · 商业交付' : 'WeChat Group Automation · Commercial'}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] font-[900] text-[1.35rem] text-[#111]">
                  WeChat Auto
                </h3>
                <p className="mt-3 text-sm leading-[1.85] text-[var(--bloom-soft)]">
                  {isChinese
                    ? '客户每天要给 33 个微信群发内容：文字、图片、视频、群公告，手动操作两小时起。微信没有群发接口，只能通过 OCR 识别界面然后模拟操作。现在 crontab 定时跑，一天四次，全程没人盯。'
                    : 'Client needed to send content daily to 33 WeChat groups — text, images, video, announcements. Two hours of manual work every day. No broadcast API, so we used OCR to read the UI and simulate the interaction. Now crontab runs it four times a day, unattended.'}
                </p>
                <div className="mt-5 border-t border-[var(--bloom-border)] pt-4">
                  <p className="text-sm font-[700] text-[#111]">
                    {isChinese ? '每天省出 2 小时，跑了数月没出问题' : '2 hours saved daily — stable for months without issues'}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(isChinese ? ['Python', 'OCR 识别', 'macOS 自动化', 'crontab'] : ['Python', 'OCR', 'macOS Automation', 'Crontab']).map((tag) => (
                    <span key={tag} className="border border-[var(--bloom-border)] px-2 py-0.5 font-[family-name:var(--font-ui)] text-[0.65rem] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.4)]">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Closet */}
            <motion.div
              className="overflow-hidden rounded-[1.5rem] border border-[var(--bloom-border)] bg-[var(--bloom-bg)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.72, ease: EASE, delay: 0.08 }}
            >
              <div className="aspect-video overflow-hidden ink-wash-panel" style={{ background: 'linear-gradient(135deg,#f4ece0 0%,#e8ddd0 50%,#f0e6d8 100%)' }}>
                <div className="flex h-full items-center justify-center">
                  <p className="font-[family-name:var(--font-display)] font-[900] text-[3rem] text-[rgba(17,17,17,0.12)] select-none">衣橱</p>
                </div>
              </div>
              <div className="p-6">
                <p className="font-[family-name:var(--font-ui)] text-[0.65rem] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.4)]">
                  {isChinese ? 'AI 产品 · 微信小程序' : 'AI Product · WeChat Mini Program'}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] font-[900] text-[1.35rem] text-[#111]">
                  AI Closet · 衣橱
                </h3>
                <p className="mt-3 text-sm leading-[1.85] text-[var(--bloom-soft)]">
                  {isChinese
                    ? '衣橱里有很多衣服，但每天不知道穿什么——不是衣服不够，是记不住、配不上。用户拍一下，AI 识别衣物类型和颜色，根据现有单品给搭配方案。微信小程序前端，Ubuntu 自建后端，MySQL 存储，aihuanai.com 上线中。'
                    : 'Closet full of clothes, no idea what to wear — the gap is memory and matching, not quantity. Users photograph their clothes, AI identifies type and color, then suggests combinations from what they already own. WeChat mini program frontend, self-hosted Ubuntu backend, live at aihuanai.com.'}
                </p>
                <div className="mt-5 border-t border-[var(--bloom-border)] pt-4">
                  <p className="text-sm font-[700] text-[#111]">
                    {isChinese ? '上线运营中，真实用户使用' : 'Live at aihuanai.com, real users active'}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(isChinese ? ['微信小程序', 'Node.js', 'AI 图像识别', 'MySQL'] : ['WeChat Mini Program', 'Node.js', 'AI Vision', 'MySQL']).map((tag) => (
                    <span key={tag} className="border border-[var(--bloom-border)] px-2 py-0.5 font-[family-name:var(--font-ui)] text-[0.65rem] uppercase tracking-[0.12em] text-[rgba(17,17,17,0.4)]">{tag}</span>
                  ))}
                </div>
                <div className="mt-4">
                  <a
                    href="https://www.aihuanai.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-[#111] underline underline-offset-4"
                  >
                    {isChinese ? '访问 aihuanai.com →' : 'Visit aihuanai.com →'}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* More screenshots — landscape */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {['/project-images/wechatauto/3.png', '/project-images/wechatauto/6.png'].map((src, i) => (
              <div key={i} className="aspect-video overflow-hidden rounded-[1.2rem] border border-[var(--bloom-border)]">
                <img src={src} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
            ))}
          </div>
          {/* Phone screenshots — portrait */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            {['/project-images/wechatauto/2.png', '/project-images/wechatauto/5.png', '/project-images/wechatauto/7.png'].map((src, i) => (
              <div key={i} className="aspect-[9/16] overflow-hidden rounded-[1.2rem] border border-[var(--bloom-border)]">
                <img src={src} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <motion.section className="bloom-contact" {...inView}>
          <p className="bloom-contact-label">
            {isChinese ? '开始合作' : 'Start a project'}
          </p>
          <h2 className="bloom-contact-heading">
            {isChinese
              ? <><span>有个项目想做？</span><br /><span>来说说。</span></>
              : <><span>Have something in mind?</span><br /><span>Tell me about it.</span></>}
          </h2>
          <p className="bloom-contact-sub">
            {isChinese
              ? '不需要想好所有细节。告诉我你想解决什么，我来判断能不能做、该怎么做。'
              : "You don't need all the details. Tell me what you want to solve — I'll figure out the path."}
          </p>
          <div className="bloom-ctas">
            <Link
              className="bloom-btn-fill safe-touch"
              to="/contact"
              data-analytics-event="commercial_cta_click"
              onClick={() => trackEvent('commercial_cta_click', { placement: 'commercial_footer' })}
            >
              {isChinese ? '来聊聊' : "Let's talk"}
            </Link>
          </div>
        </motion.section>

      </div>
    </>
  )
}
