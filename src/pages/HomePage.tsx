import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, BookOpen, Circle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useJournalEntries } from '../hooks/useJournal'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'
import { copyFor } from '../lib/copy'
import { formatDate, getProjects } from '../lib/content'

const EASE = [0.22, 1, 0.36, 1] as const
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE, delay },
})
const inView = {
  // Keep content present before IntersectionObserver runs so full-page captures,
  // print views, and fast scrolling never expose blank sections.
  initial: false,
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.85, ease: EASE },
}

export function HomePage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  const projects = getProjects()
  const { entries } = useJournalEntries()
  const latest = entries[0]
  usePageTitle(isChinese ? '小天Aya｜独立开发者与写作者' : 'XiaoTian Aya | Independent builder & writer')

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden border-b border-[var(--border-subtle)] px-5 pb-16 pt-32 md:px-8 md:pb-20 md:pt-40">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[-12vw] top-[10vh] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(176,137,78,0.12),transparent_68%)] blur-2xl" />
          <div className="brand-display absolute bottom-[-14vw] right-[-2vw] select-none text-[58vw] font-black leading-none text-[rgba(27,23,18,0.025)]">天</div>
          <div className="absolute inset-x-0 top-[46%] h-px bg-gradient-to-r from-transparent via-[rgba(17,17,17,0.06)] to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-13rem)] max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1.25fr)_22rem]">
          <div>
            <motion.p className="mb-7 text-[0.68rem] uppercase tracking-[0.28em] text-[var(--accent-soft)]" {...reveal(0.05)}>
              {isChinese ? '独立开发者 · 写作者 · AI 实践者' : 'Independent developer · Writer · AI practitioner'}
            </motion.p>
            <motion.h1 className="brand-display max-w-[12ch] text-[clamp(3.8rem,9vw,8.4rem)] font-black leading-[0.96] tracking-[-0.065em] text-[var(--text-strong)]" {...reveal(0.1)}>
              {isChinese ? <>我把好奇心<br />写下来，也把它<br />做成系统。</> : <>I write down<br />curiosity — then<br />build it.</>}
            </motion.h1>
            <motion.p className="mt-9 max-w-[38rem] text-[1rem] leading-8 text-[var(--text-soft)] md:text-[1.08rem]" {...reveal(0.26)}>
              {isChinese
                ? '这里不是简历，而是一份持续更新的个人刊物：记录 AI、产品、学习与那些从模糊念头长成真实工具的过程。'
                : 'Not a résumé, but an evolving personal publication about AI, products, learning, and the path from vague ideas to real tools.'}
            </motion.p>
            <motion.div className="mt-10 flex flex-wrap gap-3" {...reveal(0.36)}>
              <Link className="safe-touch inline-flex items-center gap-3 bg-[#171512] px-6 py-4 text-sm text-[#fffaf0] transition hover:-translate-y-0.5 hover:bg-[#2a2621]" to="/journal">
                {isChinese ? '开始阅读' : 'Start reading'} <BookOpen size={16} />
              </Link>
              <Link className="safe-touch inline-flex items-center gap-3 border border-[var(--border-subtle)] bg-white/30 px-6 py-4 text-sm text-[var(--text-strong)] transition hover:bg-white/70" to="/projects">
                {isChinese ? '看看项目' : 'Explore projects'} <ArrowDownRight size={16} />
              </Link>
            </motion.div>
          </div>

          <motion.aside className="relative justify-self-stretch rounded-[2rem] border border-[rgba(53,43,29,0.09)] bg-[rgba(255,253,248,0.68)] p-6 shadow-[0_26px_80px_rgba(79,59,31,0.09)] backdrop-blur-xl lg:justify-self-end" {...reveal(0.32)}>
            <div className="absolute right-5 top-5 flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-muted)]"><Circle className="fill-emerald-500 text-emerald-500" size={7} /> Online</div>
            <img className="avatar-pixelart h-24 w-24 rounded-[1.4rem] border border-[var(--border-subtle)] bg-[#f0e8da] object-cover" src="/avatar.png" alt={isChinese ? '小天 Aya 的头像' : 'Avatar of XiaoTian Aya'} />
            <div className="mt-7 border-t border-[var(--border-subtle)] pt-6">
              <p className="brand-display text-xl font-black tracking-[-0.025em] text-[var(--text-strong)]">小天 Aya</p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{isChinese ? '一个人在家做产品，也认真记录每一次判断、绕路和重新开始。' : 'Building products from home, while documenting the decisions, detours, and restarts.'}</p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--text-muted)]"><span>Shanghai / Remote</span><span>2026</span></div>
          </motion.aside>
        </div>
      </section>

      <div className="page-shell">
        {latest && (
          <motion.section className="grid gap-8 border-b border-[var(--border-subtle)] py-16 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-start md:py-24" {...inView}>
            <div>
              <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--accent-soft)]">{isChinese ? '最近写下' : 'Latest note'}</p>
              <p className="mt-3 text-xs text-[var(--text-muted)]">{formatDate(latest.date, language)}</p>
            </div>
            <div>
              <h2 className="brand-display max-w-[16ch] text-[clamp(2.2rem,4vw,4rem)] font-black leading-[1.05] tracking-[-0.045em] text-[var(--text-strong)]">{copyFor(language, latest.title)}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-soft)]">{copyFor(language, latest.standfirst)}</p>
              <div className="mt-6 flex flex-wrap gap-2">{latest.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-[var(--border-subtle)] px-3 py-1 text-[0.68rem] text-[var(--text-muted)]">#{tag}</span>)}</div>
            </div>
            <Link aria-label={isChinese ? '阅读最新文章' : 'Read latest article'} className="safe-touch flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-strong)] transition hover:rotate-[-8deg] hover:bg-[#171512] hover:text-white" to={`/journal/${latest.slug}`}><ArrowRight size={18} /></Link>
          </motion.section>
        )}

        <motion.section className="py-20 md:py-28" {...inView}>
          <div className="mb-12 grid gap-5 md:grid-cols-[12rem_minmax(0,1fr)]">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--accent-soft)]">{isChinese ? '项目档案' : 'Project archive'}</p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="brand-display max-w-[13ch] text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-[1.03] tracking-[-0.05em] text-[var(--text-strong)]">{isChinese ? '一些真正跑起来的东西。' : 'Things that actually run.'}</h2>
              <Link className="safe-touch inline-flex items-center gap-2 text-sm text-[var(--text-soft)] hover:text-[var(--text-strong)]" to="/projects">{isChinese ? '全部项目' : 'All projects'} <ArrowRight size={15} /></Link>
            </div>
          </div>
          <div className="border-b border-[var(--border-subtle)]">
            {projects.slice(0, 4).map((project, index) => (
              <Link key={project.slug} className="group grid gap-4 border-t border-[var(--border-subtle)] py-7 transition md:grid-cols-[5rem_minmax(0,1fr)_15rem_auto] md:items-center md:py-9" to={`/projects/${project.slug}`}>
                <span className="brand-display text-sm text-[var(--text-muted)]">0{index + 1}</span>
                <span className="brand-display text-[clamp(1.55rem,3vw,2.7rem)] font-black tracking-[-0.035em] text-[var(--text-strong)] transition duration-300 group-hover:translate-x-2">{copyFor(language, project.title)}</span>
                <span className="text-xs leading-6 text-[var(--text-muted)]">{project.year}<br />{copyFor(language, project.category)}</span>
                <ArrowRight className="text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--text-strong)]" size={18} />
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.section className="grid gap-12 border-t border-[var(--border-subtle)] py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28" {...inView}>
          <div className="md:sticky md:top-32 md:self-start">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--accent-soft)]">Journal</p>
            <h2 className="brand-display mt-5 max-w-[10ch] text-[clamp(2.6rem,5vw,4.8rem)] font-black leading-[1.03] tracking-[-0.05em] text-[var(--text-strong)]">{isChinese ? '写作是另一种版本控制。' : 'Writing is another kind of version control.'}</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-[var(--text-soft)]">{isChinese ? '它保留的不只是结论，还有当时为什么那么判断。' : 'It preserves not just the answer, but why that answer made sense at the time.'}</p>
          </div>
          <div>
            {entries.slice(0, 5).map((entry) => (
              <Link key={entry.slug} className="group block border-t border-[var(--border-subtle)] py-7 first:border-t-0 first:pt-0" to={`/journal/${entry.slug}`}>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">{formatDate(entry.date, language)} · {copyFor(language, entry.category)}</p>
                    <h3 className="brand-display mt-3 text-2xl font-black leading-tight tracking-[-0.03em] text-[var(--text-strong)] transition group-hover:text-[var(--accent-soft)] md:text-3xl">{copyFor(language, entry.title)}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--text-soft)]">{copyFor(language, entry.standfirst)}</p>
                  </div>
                  <ArrowRight className="mt-7 shrink-0 text-[var(--text-muted)] transition group-hover:translate-x-1" size={16} />
                </div>
              </Link>
            ))}
            <Link className="safe-touch mt-8 inline-flex items-center gap-2 border-b border-[var(--text-strong)] pb-1 text-sm text-[var(--text-strong)]" to="/journal">{isChinese ? '打开完整日志' : 'Open the full journal'} <ArrowRight size={14} /></Link>
          </div>
        </motion.section>

        <motion.section className="grid gap-2 border-t border-[var(--border-subtle)] py-20 md:grid-cols-2 md:py-28" {...inView}>
          <div className="ink-wash-panel min-h-[26rem] rounded-l-[2rem] p-8 md:p-11">
            <p className="relative z-10 text-[0.66rem] uppercase tracking-[0.22em] text-[var(--accent-soft)]">Now / 现在</p>
            <div className="relative z-10 mt-24 max-w-md">
              <h2 className="brand-display text-4xl font-black leading-[1.08] tracking-[-0.04em] text-[var(--text-strong)]">{isChinese ? '正在研究：怎样让 AI 系统不只聪明，还能长期稳定地工作。' : 'Studying how AI systems can stay useful and dependable — not merely clever.'}</h2>
              <p className="mt-6 text-sm leading-7 text-[var(--text-soft)]">{isChinese ? '关注 Agent、自动化工作流、知识产品，也持续整理做产品时遇到的真实问题。' : 'Agents, automated workflows, knowledge products, and the honest problems encountered while building them.'}</p>
            </div>
          </div>
          <div className="flex min-h-[26rem] flex-col justify-between rounded-r-[2rem] border border-[var(--border-subtle)] bg-[rgba(255,253,248,0.62)] p-8 md:p-11">
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-[var(--accent-soft)]">About</p>
            <div>
              <h2 className="brand-display text-4xl font-black leading-[1.08] tracking-[-0.04em] text-[var(--text-strong)]">{isChinese ? '我叫小天。一个人做产品，也把思考公开。' : 'I’m Tian. I build independently and think in public.'}</h2>
              <p className="mt-6 text-sm leading-7 text-[var(--text-soft)]">{isChinese ? '比起追逐最新名词，我更在意一个工具是否真的替人省下时间，以及几年后还能不能被看懂、被维护。' : 'I care less about the newest label than whether a tool saves real time and remains understandable years later.'}</p>
              <Link className="safe-touch mt-8 inline-flex items-center gap-2 text-sm text-[var(--text-strong)]" to="/about">{isChinese ? '更多关于我' : 'More about me'} <ArrowRight size={14} /></Link>
            </div>
          </div>
        </motion.section>

        <motion.section className="border-t border-[var(--border-subtle)] py-24 text-center md:py-36" {...inView}>
          <p className="text-[0.66rem] uppercase tracking-[0.24em] text-[var(--accent-soft)]">A quiet invitation</p>
          <h2 className="brand-display mx-auto mt-7 max-w-[13ch] text-[clamp(2.8rem,6vw,6rem)] font-black leading-[1.02] tracking-[-0.055em] text-[var(--text-strong)]">{isChinese ? '有值得认真做的事，就写信给我。' : 'If it deserves careful work, write to me.'}</h2>
          <Link className="safe-touch mt-10 inline-flex items-center gap-3 bg-[#171512] px-7 py-4 text-sm text-[#fffaf0]" to="/contact">{isChinese ? '聊聊你的想法' : 'Tell me about it'} <ArrowRight size={16} /></Link>
        </motion.section>
      </div>
    </>
  )
}
