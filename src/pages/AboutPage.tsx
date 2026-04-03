import { PageHero } from '../components/PageHero'
import { editorialMedia } from '../data/media'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'

const values = [
  {
    zh: '先定义问题与工作流，再谈模型与工具。',
    en: 'Define the problem and workflow before choosing models and tools.',
  },
  {
    zh: '研究不是抽象姿态，而是帮助项目变得更稳的方式。',
    en: 'Research is not a pose; it is a way to make projects more durable.',
  },
  {
    zh: '前端体验要能承接复杂系统，而不是只承担展示表层。',
    en: 'Frontend experience should carry complex systems, not just decorate the surface.',
  },
]

export function AboutPage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'
  usePageTitle(
    language === 'zh'
      ? '关于 | 小天Aya｜BemsZzz'
      : 'About | XiaoTian Aya | BemsZzz',
  )

  return (
    <>
      <PageHero
        eyebrow="About"
        title={language === 'zh' ? '研究者视角，产品化表达。' : 'A researcher lens, expressed through product work.'}
        description={language === 'zh' ? '我主要围绕 AI Agent、内容系统和研究驱动的产品界面工作。研究者与 AI 学习者身份是真实存在的，但我更关注如何把这些身份转成可交付的东西。' : 'My work centers on AI agents, content systems, and research-led product interfaces. The researcher and AI learner identity is real, but I care most about how it becomes something deliverable.'}
        aside={
          <div className="flex items-center gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[var(--accent-soft)] bg-[radial-gradient(circle_at_30%_30%,rgba(219,188,131,0.28),transparent_40%),linear-gradient(180deg,#1b1611_0%,#100d0a_100%)] text-3xl text-[var(--home-text)] shadow-[var(--shadow-soft)]">
              Aya
            </div>
            <div className="text-sm leading-7 text-[var(--text-soft)]">
              <p>AI Agent</p>
              <p>Research</p>
              <p>Publishing System</p>
            </div>
          </div>
        }
      />
      <section className="page-shell py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <section className="paper-panel">
            <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.2rem] leading-[1.12]' : 'text-3xl'}`}>
              {language === 'zh' ? '我如何工作' : 'How I work'}
            </h2>
            <div className="mt-5 space-y-4 reading-copy">
              <p>
                {language === 'zh'
                  ? '我会先拆清问题边界、输入结构和最终交付物，再决定 Agent、前端界面和自动化流程该如何组合。'
                  : 'I start by clarifying problem boundaries, input structure, and the final deliverable, then decide how agents, frontend surfaces, and automation should fit together.'}
              </p>
              <p>
                {language === 'zh'
                  ? '这意味着我既关心研究深度，也关心产品上线后的真实使用状态。'
                  : 'That means balancing research depth with the reality of how a system will actually be used once it ships.'}
              </p>
            </div>
          </section>
          <section className="paper-panel">
            <figure className="editorial-figure editorial-figure-compact mb-6">
              <img
                src={editorialMedia.architecture}
                alt={language === 'zh' ? '浅色建筑感身份主视觉' : 'Architectural identity visual'}
                className="editorial-figure-image"
                loading="lazy"
              />
            </figure>
            <h2 className={`brand-display text-[var(--text-strong)] ${isChinese ? 'text-[2.2rem] leading-[1.12]' : 'text-3xl'}`}>
              {language === 'zh' ? '适合合作的事项' : 'Good fit for collaboration'}
            </h2>
            <ul className={`mt-5 space-y-3 text-[var(--text-soft)] ${isChinese ? 'text-[1.02rem] leading-[1.88]' : 'text-base leading-8'}`}>
              <li>{language === 'zh' ? 'AI Agent 产品与工作流设计' : 'AI agent product and workflow design'}</li>
              <li>{language === 'zh' ? '内容系统、知识系统与写作产品' : 'Publishing systems, knowledge systems, and writing products'}</li>
              <li>{language === 'zh' ? '研究导向的前端界面与项目展示' : 'Research-led frontend interfaces and portfolio surfaces'}</li>
            </ul>
          </section>
        </div>
      </section>
      <section className="page-shell pb-20 md:pb-28">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.en} className="paper-panel">
              <p className="text-lg leading-8 text-[var(--text-soft)]">
                {language === 'zh' ? value.zh : value.en}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
