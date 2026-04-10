import type { Language } from '../types/content'

interface ContactPanelProps {
  language: Language
}

export function ContactPanel({ language }: ContactPanelProps) {
  const isChinese = language === 'zh'

  return (
    <section className="paper-panel">
      <p
        className={`brand-ui text-[var(--text-muted)] ${
          isChinese
            ? 'text-[0.82rem] tracking-[0.08em]'
            : 'text-xs uppercase tracking-[0.28em]'
        }`}
      >
        {language === 'zh' ? '来聊' : 'Get in touch'}
      </p>
      <h2
        className={`brand-display mt-5 text-[var(--text-strong)] ${
          isChinese
            ? 'text-[2.8rem] leading-[1.04] md:text-[4.2rem]'
            : 'text-4xl leading-[0.96] md:text-5xl'
        }`}
      >
        {language === 'zh' ? '把你的想法发过来。' : 'Send me your idea.'}
      </h2>
      <p className={`mt-5 max-w-2xl text-[var(--text-soft)] ${isChinese ? 'text-[1.08rem] leading-[1.95]' : 'text-lg leading-8'}`}>
        {language === 'zh'
          ? 'AI 产品想法、想自动化的流程、觉得有意思但不知道怎么做的事 —— 都可以。我来判断能不能做、怎么做，然后把它做出来。'
          : 'AI product concepts, workflows you want automated, things that seem interesting but you\'re not sure are buildable — all good. I\'ll figure out the approach and make it happen.'}
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
            Email
          </p>
          <a className="safe-touch mt-3 inline-block text-[var(--text-strong)]" href="mailto:hello@replace-me.com">
            hello@replace-me.com
          </a>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
            GitHub
          </p>
          <a
            className="safe-touch mt-3 inline-block text-[var(--text-strong)]"
            href="https://github.com/replace-me"
            target="_blank"
            rel="noreferrer"
          >
            github.com/replace-me
          </a>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.24em]'}`}>
            {language === 'zh' ? '回复预期' : 'Response window'}
          </p>
          <p className="mt-3 text-[var(--text-strong)]">
            {language === 'zh' ? '通常在 2 个工作日内回复。' : 'Usually within two business days.'}
          </p>
        </div>
      </div>
    </section>
  )
}
