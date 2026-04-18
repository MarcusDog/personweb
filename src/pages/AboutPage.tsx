import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { editorialMedia, showcaseImages } from '../data/media'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'

const methodNotes = [
  {
    title: { zh: '先确认问题是不是真的', en: 'Validate the problem first' },
    body: {
      zh: '我不会一上来就堆功能。先把场景、重复动作、判断成本和真实使用者说清楚，再决定 AI 应该接管哪一段。',
      en: 'I do not start by stacking features. I first clarify the scene, repetitive action, judgment cost, and real user before deciding where AI should take over.',
    },
  },
  {
    title: { zh: '先让它跑起来', en: 'Make it run first' },
    body: {
      zh: '原型不是幻灯片，也不是静态页面。它必须能真实输入、真实处理、真实产出，哪怕第一版很粗糙。',
      en: 'A prototype is not a slide deck or a static screen. It needs real input, real processing, and real output, even if the first version is rough.',
    },
  },
  {
    title: { zh: '再决定要不要打磨', en: 'Then decide whether to polish' },
    body: {
      zh: '能跑不等于值得继续。只有当它真的节省时间、降低判断成本、或者让人更愿意继续使用时，才进入下一轮设计。',
      en: 'Running is not the same as worth continuing. I only deepen a system when it saves time, lowers judgment cost, or makes someone want to return.',
    },
  },
  {
    title: { zh: '把复杂留在系统里', en: 'Keep complexity inside the system' },
    body: {
      zh: '好的 AI 工具不应该把复杂度转嫁给用户。模型、提示词、检索、失败恢复和边界条件都应该被系统吸收。',
      en: 'A good AI tool should not push complexity onto the user. Models, prompts, retrieval, recovery, and edge cases should be absorbed by the system.',
    },
  },
]

const values = [
  {
    zh: 'AI 最大的价值不是替代人，是替代人类工作里那些没必要由人来做的部分。真正需要判断力的事，还是要靠人。',
    en: "AI's greatest value isn't replacing people — it's replacing the parts of human work that don't require human judgment. The things that actually need judgment still need a person.",
  },
  {
    zh: '最好的工具是用完感觉不到工具的存在。如果用户还在想"怎么用它"，它就还不够好。',
    en: "The best tools are the ones you stop noticing. If a user is still thinking about how to use it, it's not good enough yet.",
  },
  {
    zh: '有意思的想法永远比完美的代码更重要。先让它工作，再让它好看，最后才考虑让它完美。',
    en: 'An interesting idea always beats perfect code. Make it work first. Make it good second. Make it perfect last — if ever.',
  },
]

export function AboutPage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  usePageTitle(
    language === 'zh'
      ? '关于 | 小天Aya'
      : 'About | XiaoTian Aya',
  )

  return (
    <>
      {/* ─── Page hero ─────────────────────────────────── */}
      <PageHero
        eyebrow="About"
        title={language === 'zh'
          ? '独立开发者，专注 AI Agent 系统落地。'
          : 'Independent developer. Focused on AI agent systems that actually work.'}
        description={language === 'zh'
          ? '在 AI 与日常生活的交叉点持续探索——核心驱动力只有一个：技术能否真正服务于人，而不只是展示能力。欢迎来聊。'
          : 'Continuously exploring the intersection of AI and everyday life — driven by one core question: can technology genuinely serve people, or only demonstrate capability? Come talk.'}
        aside={
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--accent-soft)] bg-[radial-gradient(circle_at_30%_30%,rgba(219,188,131,0.28),transparent_40%),linear-gradient(180deg,#1b1611_0%,#100d0a_100%)] text-2xl text-[var(--home-text)] shadow-[var(--shadow-soft)]">
              Aya
            </div>
            <div className={`text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[2]' : 'text-sm leading-7'}`}>
              <p>{language === 'zh' ? '独立开发者' : 'Independent Developer'}</p>
              <p>{language === 'zh' ? 'AI Agent 系统' : 'AI Agent Systems'}</p>
              <p>{language === 'zh' ? 'Vibe Coding 方法论' : 'Vibe Coding Methodology'}</p>
            </div>
          </div>
        }
      />

      <section className="page-shell py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
          <div className="paper-panel">
            <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '快速摘要' : 'Quick Summary'}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                {
                  title: { zh: '我是谁', en: 'Who I am' },
                  body: { zh: '深度依赖 AI 协作的独立开发者。', en: 'An independent developer working deeply with AI.' },
                },
                {
                  title: { zh: '我做什么', en: 'What I build' },
                  body: { zh: 'AI Agent 系统、自动化流程、从 0 到可用原型。', en: 'AI agent systems, automation workflows, and usable prototypes.' },
                },
                {
                  title: { zh: '如何合作', en: 'How collaboration works' },
                  body: { zh: '先做需求拆解，再确认边界、路径和首个可运行版本。', en: 'Start with a brief, then define scope, path, and first working version.' },
                },
                {
                  title: { zh: '交付类型', en: 'Delivery types' },
                  body: { zh: '架构评估、原型落地、工作流自动化、案例型产品页。', en: 'Architecture review, prototype delivery, workflow automation, and product-facing pages.' },
                },
              ].map((item) => (
                <article key={item.title.en} className="border-t border-[var(--border-subtle)] pt-4 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-4">
                  <h2 className={`text-[var(--text-strong)] ${isChinese ? 'text-[1.1rem] leading-7' : 'text-base font-semibold'}`}>
                    {language === 'zh' ? item.title.zh : item.title.en}
                  </h2>
                  <p className={`mt-2 text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-7' : 'text-sm leading-6'}`}>
                    {language === 'zh' ? item.body.zh : item.body.en}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="paper-panel">
            <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '不适合合作的情况' : 'Not a good fit'}
            </p>
            <ul className={`mt-5 space-y-3 text-[var(--text-soft)] ${isChinese ? 'text-[1rem] leading-8' : 'text-sm leading-6'}`}>
              {(language === 'zh'
                ? [
                    '只想要一个无法验证的概念包装，但不打算让它真实运行。',
                    '希望跳过需求边界，直接堆功能或追逐最新模型名词。',
                    '无法提供基本业务背景、使用场景或后续反馈。',
                  ]
                : [
                    'You only want concept packaging with no intent to make it run.',
                    'You want to skip boundaries and stack features or model names.',
                    'You cannot provide basic context, usage scenarios, or feedback.',
                  ]
              ).map((item) => (
                <li key={item} className="border-t border-[var(--border-subtle)] pt-3 first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── Work gallery ──────────────────────────────── */}
      <section className="page-shell py-10 md:py-14">
        <p className={`brand-ui mb-6 text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
          {language === 'zh' ? '近期作品' : 'Recent work'}
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {showcaseImages.map((src, i) => {
            const labels: { zh: string; en: string }[] = [
              { zh: 'Ainews — 主界面', en: 'Ainews — Main view' },
              { zh: 'Ainews — 分析模块', en: 'Ainews — Analytics' },
              { zh: 'Ainews — 资讯流', en: 'Ainews — Feed' },
              { zh: 'LearningByDoing — 工作室', en: 'LearningByDoing — Studio' },
              { zh: 'LearningByDoing — 课程', en: 'LearningByDoing — Courses' },
              { zh: 'LearningByDoing — 详情', en: 'LearningByDoing — Detail' },
            ]
            return (
              <motion.figure
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
                className="group overflow-hidden rounded-[1.4rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)] shadow-[var(--shadow-soft)]"
              >
                <div className="overflow-hidden">
                  <img
                    src={src}
                    alt={isChinese ? labels[i].zh : labels[i].en}
                    className="w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <figcaption className={`px-4 py-2.5 text-[var(--text-muted)] ${isChinese ? 'text-[0.78rem] tracking-[0.05em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
                  {isChinese ? labels[i].zh : labels[i].en}
                </figcaption>
              </motion.figure>
            )
          })}
        </div>
        <div className="mt-6 text-right">
          <Link
            to="/projects"
            className={`inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-strong)] ${isChinese ? 'tracking-[0.06em]' : 'uppercase tracking-[0.12em]'}`}
          >
            {language === 'zh' ? '查看所有项目' : 'View all projects'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── Bio + editorial image ─────────────────────── */}
      <section className="page-shell py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.88fr)] md:items-start">
          <div className="paper-panel">
            <p className={`brand-ui mb-5 text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '我是谁' : 'Who I am'}
            </p>
            <div className="reading-copy space-y-4">
              {language === 'zh' ? (
                <>
                  <p>我叫小天，是一个深度依赖 AI 协作的独立开发者。</p>
                  <p>工作越久越觉得一件事是真的：真正改变日常生活的，往往不是某个单一的技术突破，而是有人花时间把现有的工具连接起来，做成别人真正用得上的东西。这是我工作的出发点。</p>
                  <p>我把自己的工作方法叫做「vibe coding」——不是随便折腾，而是一种有节奏的快速验证方式：提出一个想法，用最短路径让它运转起来，在真实场景中观察它的表现，然后决定是深化还是放弃。</p>
                  <p>在这个过程中，AI 承担了大量我以前需要自己处理的重复工作：写样板代码、调整结构、处理边缘情况。而我把精力放在真正需要判断力的部分——这个问题值得解决吗？这个方向对吗？用户真的会这样用它吗？</p>
                  <p>这种分工方式让一个人能做到以前需要团队才能做到的事。不是因为 AI 无所不能，而是因为它恰好擅长做那些让人类效率最低的事情。</p>
                </>
              ) : (
                <>
                  <p>I'm Tian — an independent developer who works closely with AI as a collaborator, not just a tool.</p>
                  <p>The longer I work in this space, the more I believe one thing: what actually changes daily life isn't usually a single technical breakthrough — it's someone spending time connecting existing tools and shaping them into something people genuinely use. That's my starting point.</p>
                  <p>My methodology is what I call "vibe coding" — not aimless tinkering, but disciplined fast-iteration. Start with an idea, take the shortest path to getting it running, observe how it behaves in real conditions, then decide whether to deepen or abandon it.</p>
                  <p>In this process, AI absorbs the work that takes time but doesn't require judgment: boilerplate, structural adjustments, edge cases. I focus remaining energy on the things that actually need a human: Is this problem worth solving? Is this direction right? Will anyone actually use it this way?</p>
                  <p>This division of labor lets one person accomplish what used to require a team — not because AI can do anything, but because it happens to excel at exactly the things that make human work least efficient.</p>
                </>
              )}
            </div>
          </div>
          <div className="space-y-5">
            <figure className="editorial-figure overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src={editorialMedia.goldTexture}
                alt={language === 'zh' ? '质感细节' : 'Material texture'}
                className="editorial-figure-image"
                loading="lazy"
              />
            </figure>
            <figure className="editorial-figure editorial-figure-compact overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src={editorialMedia.brushedMetal}
                alt={language === 'zh' ? '精密与细节' : 'Precision and detail'}
                className="editorial-figure-image"
                loading="lazy"
              />
              <figcaption className="editorial-figure-caption">
                {language === 'zh'
                  ? '最好的系统是让人感觉不到系统存在的系统。'
                  : 'The best system is the one you stop noticing.'}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ─── Working method ─────────────────────────────── */}
      <section className="page-shell py-10 md:py-14">
        <p className={`brand-ui mb-8 text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
          {language === 'zh' ? '工作方法' : 'Working Method'}
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {methodNotes.map((area, i) => (
            <motion.article
              key={area.title.en}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="paper-panel"
            >
              <h3 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2rem] leading-[1.12]' : 'text-2xl leading-tight'}`}>
                {isChinese ? area.title.zh : area.title.en}
              </h3>
              <p className={`mt-4 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.9]' : 'text-base leading-8'}`}>
                {isChinese ? area.body.zh : area.body.en}
              </p>
            </motion.article>
          ))}
        </div>
        <figure className="mt-8 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
          <img
            src={editorialMedia.concreteMinimal}
            alt=""
            aria-hidden="true"
            className="w-full object-cover max-h-52"
            loading="lazy"
          />
        </figure>
      </section>

      {/* ─── Additional project images ─────────────────── */}
      <section className="page-shell py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)]">
          <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
            <img
              src="/project-images/learningbydoing/8.png"
              alt={language === 'zh' ? 'LearningByDoing AI 学习工作室' : 'LearningByDoing AI Learning Studio'}
              className="w-full object-cover"
              loading="lazy"
            />
            <figcaption className="border-t border-[var(--border-subtle)] px-5 py-3 text-[var(--text-muted)] text-sm">
              {language === 'zh'
                ? 'LearningByDoing — AI 辅助学习工作站，课程生成与进度追踪'
                : 'LearningByDoing — AI-assisted learning workspace, course generation & progress tracking'}
            </figcaption>
          </figure>
          <div className="space-y-4">
            <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src="/project-images/ainews/2.png"
                alt={language === 'zh' ? 'Ainews 搜索功能' : 'Ainews search'}
                className="w-full object-cover"
                loading="lazy"
              />
            </figure>
            <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src="/project-images/learningbydoing/4.png"
                alt={language === 'zh' ? 'LearningByDoing 课程详情' : 'LearningByDoing course detail'}
                className="w-full object-cover"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
            <img
              src={editorialMedia.warmBokeh}
              alt=""
              aria-hidden="true"
              className="w-full object-cover"
              loading="lazy"
            />
          </figure>
          <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
            <img
              src={editorialMedia.lightBokeh}
              alt=""
              aria-hidden="true"
              className="w-full object-cover"
              loading="lazy"
            />
          </figure>
        </div>
      </section>

      {/* ─── Why collaborate ───────────────────────────── */}
      <section className="page-shell py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
          <div>
            <p className={`brand-ui mb-5 text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '适合找我聊的事' : 'When to reach out'}
            </p>
            <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.6rem] leading-[1.06]' : 'text-4xl leading-tight'}`}>
              {language === 'zh' ? '你有 idea，我来判断能不能做，然后做出来。' : 'You have the idea. I assess feasibility. Then I build it.'}
            </h2>
            <p className={`mt-5 text-[var(--text-soft)] ${isChinese ? 'text-[1.05rem] leading-[1.95]' : 'text-base leading-8'}`}>
              {language === 'zh'
                ? '想法成型或不成型都可以来聊。你不需要知道技术细节——那是我的工作。你只需要有一个想法，或者一个让你烦恼很久的问题。'
                : "Doesn't matter how formed the idea is. You don't need to know the technical details — that's my job. Bring an idea, or a problem that's been annoying you for a while."}
            </p>
            <figure className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src={editorialMedia.architecture}
                alt=""
                aria-hidden="true"
                className="w-full object-cover max-h-44"
                loading="lazy"
              />
            </figure>
          </div>
          <ul className={`space-y-4 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.88]' : 'text-base leading-8'}`}>
            {(language === 'zh'
              ? [
                  '你有一个 idea，但不知道技术上能不能做到',
                  '你有某件重复的事每天都在做，觉得应该可以自动化',
                  '你想快速验证一个想法，需要有人帮你从 0 做到能用',
                  '你在做的项目需要加入 AI 能力，不知道从哪里接入',
                  '你只是想聊聊 AI 现在能做什么、不能做什么',
                ]
              : [
                  "You have an idea but aren't sure if it's technically feasible",
                  'You have a repetitive task you do every day that feels like it should be automated',
                  'You want to validate an idea fast and need someone to go from zero to usable',
                  "Your current project needs AI capability and you don't know where to plug it in",
                  'You just want to talk through what AI can and can\'t actually do right now',
                ]
            ).map((item) => (
              <li key={item} className="flex items-start gap-3 border-t border-[var(--border-subtle)] pt-4 first:border-t-0 first:pt-0">
                <span className="mt-[0.32em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-strong)]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Values ────────────────────────────────────── */}
      <section className="page-shell pb-20 md:pb-28">
        <figure className="mb-8 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
          <img
            src={editorialMedia.darkAbstract}
            alt=""
            aria-hidden="true"
            className="w-full object-cover max-h-56"
            loading="lazy"
          />
        </figure>
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.en} className="paper-panel">
              <p className={`text-[var(--text-soft)] ${isChinese ? 'text-[1.04rem] leading-[1.95]' : 'text-base leading-8'}`}>
                {language === 'zh' ? value.zh : value.en}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
