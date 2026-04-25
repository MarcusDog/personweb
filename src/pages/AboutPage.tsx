import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHero } from '../components/PageHero'
import { editorialMedia, showcaseImages } from '../data/media'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'

const methodNotes = [
  {
    title: { zh: '先确认问题是不是真的', en: 'Is the problem real?' },
    body: {
      zh: '很多时候以为需要 AI，其实只需要一个定时任务。先说清楚谁在用、每天卡在哪里、卡了之后怎么办——再决定 AI 该不该接进来。',
      en: "A lot of times you think you need AI when you really just need a cron job. Tell me who uses it, where they get stuck, what happens when they do — then we decide if AI belongs here.",
    },
  },
  {
    title: { zh: '先让它跑起来', en: 'Get it running first' },
    body: {
      zh: '原型不是截图，也不是"大概逻辑就是这样"。它得能点、能输入、能出结果——哪怕第一版丑、慢、只有三个功能，也要是真实在跑的。',
      en: "A prototype isn't a screenshot or a rough idea sketch. It clicks, takes input, gives output — even if v1 is ugly, slow, and does only three things, it has to actually run.",
    },
  },
  {
    title: { zh: '跑了才知道要不要继续', en: 'Running first, then decide' },
    body: {
      zh: '有时候做出来跑了，才发现不是你想要的——这比三个月后才发现好太多了。跑起来，才有真实的东西可以谈。',
      en: "Sometimes you build it, run it, and realize it's not what you wanted. That's fine — it's much better than spending three months before finding out. Running gives us something real to talk about.",
    },
  },
  {
    title: { zh: '把复杂藏在里面', en: 'Complexity belongs inside' },
    body: {
      zh: '用的人感觉不到背后多复杂，才叫做好了。模型、重试、格式转换——这些都该消化在系统里，用户只管输入、只管看结果。',
      en: "The sign of a good AI tool is that users don't feel the complexity. Models, retries, format handling — all of it disappears inside. Users put something in, something useful comes out.",
    },
  },
]

const values = [
  {
    zh: 'AI 最擅长的，是那些你做了一百遍、每次都在抗拒、但又不得不做的事。需要你真正拍板的地方，它还去不了——至少现在还不行。',
    en: "AI is at its best doing the thing you've done a hundred times, always resisted doing, but had to anyway. Where you actually need to call a shot — it can't go there yet. At least not now.",
  },
  {
    zh: '用完感觉不到它存在，才是真的好用。如果你用完还在想"这个工具好像挺聪明的"，说明它还没做透。',
    en: "You know a tool is done when you forget it's there. If you finish using it and think 'that was clever' — it's not done yet.",
  },
  {
    zh: '有意思的想法比漂亮的代码重要得多。先让它跑，再让它好看，最后——如果真的有必要——才让它完美。大多数情况下，完美那一步永远不会来。',
    en: "A genuinely interesting idea is worth more than beautiful code. Get it running. Make it clean. Polish it last — if that day ever actually arrives. Usually it doesn't.",
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
          ? '我叫小天，一个人做 AI 系统。'
          : "I'm Tian. I build AI systems, alone."}
        description={language === 'zh'
          ? '有些事每天都在耗人的时间，但从来不需要人来做——找到这些，把它们交给机器，是我觉得最值得干的事。'
          : "Some things drain people's time every day and never actually needed a human. Finding those and handing them to machines — that's the work I find most worth doing."}
        aside={
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src="/avatar.png"
                alt="小天Aya"
                className="h-full w-full object-cover avatar-pixelart"
                style={{ objectPosition: 'center 15%' }}
              />
            </div>
            <div className={`text-[var(--text-soft)] ${isChinese ? 'text-[0.98rem] leading-[2]' : 'text-sm leading-7'}`}>
              <p>{language === 'zh' ? '独立开发者' : 'Independent Developer'}</p>
              <p>{language === 'zh' ? 'AI Agent 系统' : 'AI Agent Systems'}</p>
              <p>{language === 'zh' ? '快速验证，真实落地' : 'Fast validation, real deployment'}</p>
            </div>
          </div>
        }
      />

      <section className="page-shell py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
          <div className="paper-panel">
            <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
              {language === 'zh' ? '几句话说清楚' : 'The short version'}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {[
                {
                  title: { zh: '我是谁', en: 'Who I am' },
                  body: { zh: '在家工作的独立开发者，AI 是我主要的协作方式，不是偶尔用一下的工具。', en: 'Independent developer working from home. AI is how I work, not something I occasionally use.' },
                },
                {
                  title: { zh: '我做什么', en: 'What I build' },
                  body: { zh: 'AI 自动化系统、从想法到上线的完整产品、那些以前需要有人天天盯着的流程。', en: 'AI automation systems, products from idea to launch, and workflows that used to need someone watching every day.' },
                },
                {
                  title: { zh: '怎么合作', en: 'How it works' },
                  body: { zh: '先聊清楚问题，定好第一版做什么，两周内你能看到真实跑着的版本。', en: 'Talk through the problem, agree on what version one does, then two weeks to something real.' },
                },
                {
                  title: { zh: '做过什么', en: 'What I\'ve done' },
                  body: { zh: '微信群自动化、AI 衣橱 App、AI 资讯平台、交互学习工作台，以及各种小工具。', en: 'WeChat group automation, AI wardrobe app, AI news platform, interactive learning workspace, and various tools.' },
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
              {language === 'zh' ? '可能不太合适的情况' : 'Might not be a good fit'}
            </p>
            <ul className={`mt-5 space-y-3 text-[var(--text-soft)] ${isChinese ? 'text-[1rem] leading-8' : 'text-sm leading-6'}`}>
              {(language === 'zh'
                ? [
                    '想要一份好看的方案书，但不打算真的做出来——我做不来纯包装的事。',
                    '不太清楚自己想解决什么，也没时间聊清楚——没有基本背景我没办法开始。',
                    '想追最新的模型名词，但不在乎能不能解决实际问题——这个方向我们可能合不来。',
                  ]
                : [
                    "You want a polished-looking proposal but don't intend to actually build it — I can't help with pure packaging.",
                    "You're not sure what you want to solve and don't have time to figure it out — I need basic context to get started.",
                    "You want to use the latest model names but don't care whether it actually solves anything — we'd probably have a hard time working together.",
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
                  <p>我叫小天，在家工作的独立开发者。我平时就一个人对着电脑，AI 是我最主要的搭档。</p>
                  <p>干这行干久了，越来越觉得：真正让人感受到变化的，很少是某个厉害的新模型——更多是有人花时间把手头的工具连起来，做成一个别人真的会天天用的东西。我做的大部分项目都在这里。</p>
                  <p>我有个习惯：有了想法就先让它跑起来。不写 PRD，不画原型图，直接找最短路径做个能跑的版本，放到真实环境里看它怎么表现，然后再决定要不要继续。我把这个叫 vibe coding——不是随便瞎搞，是有节奏地快速试错。</p>
                  <p>AI 在里面干什么？写重复的结构、处理边缘情况、调整格式——那些我知道怎么做、但写起来没劲的事。我的时间留给真正需要想清楚的问题：这件事值不值得做？方向对不对？做出来真的有人用吗？</p>
                  <p>这种分工让我一个人能干以前要一个团队才能干的事。不是因为 AI 无所不能，而是它刚好最擅长那些最耗人的部分。</p>
                </>
              ) : (
                <>
                  <p>I'm Tian. I work from home, mostly by myself — AI is my main collaborator, not something I use occasionally.</p>
                  <p>The longer I work in this space, the more I believe: what actually changes people's daily lives usually isn't the newest impressive model. It's someone patient enough to connect existing tools into something people will actually use every day. Most of my projects live there.</p>
                  <p>My habit: when I have an idea, I skip the planning doc and get something running. No PRD, no wireframe — shortest path to a working version, then I put it in a real environment and watch how it behaves. I call this vibe coding. Not aimless tinkering. Rhythmic fast iteration.</p>
                  <p>AI handles the stuff I know how to do but find boring: repetitive structure, edge cases, formatting. My time goes to the questions that need actual thinking: Is this worth building? Am I pointing in the right direction? Will anyone actually use it this way?</p>
                  <p>That split lets one person do what used to take a team. Not because AI can do everything, but because it's surprisingly good at exactly the parts that drain people the most.</p>
                </>
              )}
            </div>
          </div>
          <div className="space-y-5">
            <figure className="overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src="/avatar.png"
                alt={language === 'zh' ? '小天Aya' : 'XiaoTian Aya'}
                className="w-full object-cover avatar-pixelart"
                style={{ aspectRatio: '4/3', objectPosition: 'center 12%' }}
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
            src={editorialMedia.inkWall}
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
        <div className="mt-4 grid grid-cols-2 gap-4" aria-hidden="true">
          <div className="ink-wash-panel min-h-[9rem] overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]" />
          <div className="ink-wash-panel min-h-[9rem] overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]" style={{ background: 'linear-gradient(160deg,#f0e6d8 0%,#e9ddd0 45%,#f5ece0 100%)' }} />
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
              {language === 'zh' ? '你有想法，我来判断能不能做，然后做出来。' : 'You have the idea. I figure out if it works. Then I build it.'}
            </h2>
            <p className={`mt-5 text-[var(--text-soft)] ${isChinese ? 'text-[1.05rem] leading-[1.95]' : 'text-base leading-8'}`}>
              {language === 'zh'
                ? '成不成型都可以来聊。你不需要知道技术细节——那是我的事。你只需要有一个想法，或者一件让你烦了很久、一直没时间管的事。'
                : "Doesn't matter how formed the idea is. You don't need technical knowledge — that's my part. Bring an idea, or a problem that's been sitting there for too long."}

            </p>
            <figure className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border-subtle)] shadow-[var(--shadow-soft)]">
              <img
                src={editorialMedia.zenRock}
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
                  '有个想法，不确定技术上能不能做到',
                  '有件每天都在重复的事，感觉应该能自动化，但不知道怎么弄',
                  '想快速验证一个方向，需要有人帮你从零做到能真实用上',
                  '项目里想接入 AI，但不知道该在哪里接、接了有没有用',
                  '就是想聊聊 AI 现在能做什么、不能做什么',
                ]
              : [
                  "You have an idea but aren't sure if it's technically possible",
                  'You have a repetitive task every day that feels like it should be automatable',
                  'You want to validate a direction fast — need someone to go from zero to actually usable',
                  "Your project needs AI somewhere but you're not sure where or whether it'll help",
                  'You just want an honest conversation about what AI can and can\'t do right now',
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
            src={editorialMedia.paper}
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
