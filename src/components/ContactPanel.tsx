import { useState } from 'react'

import { trackEvent } from '../lib/analytics'
import type { Language } from '../types/content'

interface ContactPanelProps {
  language: Language
  showForm?: boolean
}

export function ContactPanel({ language, showForm = false }: ContactPanelProps) {
  const isChinese = language === 'zh'
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="paper-panel">
      <p
        className={`brand-ui text-[var(--text-muted)] ${
          isChinese
            ? 'text-[0.82rem] tracking-[0.08em]'
            : 'text-xs uppercase tracking-[0.12em]'
        }`}
      >
        {language === 'zh' ? '来聊聊' : 'Get in touch'}
      </p>
      <h2
        className={`brand-display mt-5 text-[var(--text-strong)] ${
          isChinese
            ? 'text-[2.8rem] leading-[1.04] md:text-[4.2rem]'
            : 'text-4xl leading-[0.96] md:text-5xl'
        }`}
      >
        {language === 'zh' ? '把你的想法发过来。' : 'Tell me what\'s on your mind.'}
      </h2>
      <p className={`mt-5 max-w-2xl text-[var(--text-soft)] ${isChinese ? 'text-[1.08rem] leading-[1.95]' : 'text-lg leading-8'}`}>
        {language === 'zh'
          ? 'AI 自动化想法、想解决的重复流程、不确定能不能做的事——都行。成不成型都可以先说，我来判断能不能做、该怎么做。'
          : 'AI automation ideas, repetitive workflows you want out of your life, things you\'re not sure are buildable — all fine. Formed or not, just say it. I\'ll figure out if it\'s doable and how.'}
      </p>
      {showForm ? (
        <form
          className="mt-10 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            trackEvent('contact_form_submit', { source: 'contact_panel' })
            setSubmitted(true)
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--text-soft)]">
              <span>{language === 'zh' ? '你是谁' : 'Who are you?'}</span>
              <select className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--text-strong)]" required>
                <option>{language === 'zh' ? '独立开发者/创业者' : 'Independent builder / founder'}</option>
                <option>{language === 'zh' ? '小团队' : 'Small team'}</option>
                <option>{language === 'zh' ? '产品经理/运营' : 'Product manager / operator'}</option>
                <option>{language === 'zh' ? '内容创作者' : 'Content creator'}</option>
                <option>{language === 'zh' ? '公司/企业' : 'Company / enterprise'}</option>
                <option>{language === 'zh' ? '学生/研究者' : 'Student / researcher'}</option>
                <option>{language === 'zh' ? '就是想聊聊' : 'Just want to chat'}</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-soft)]">
              <span>{language === 'zh' ? '期望交付' : 'Expected delivery'}</span>
              <select className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--text-strong)]" required>
                <option>{language === 'zh' ? 'AI Agent 系统' : 'AI agent system'}</option>
                <option>{language === 'zh' ? '自动化流程' : 'Automation workflow'}</option>
                <option>{language === 'zh' ? '可用原型' : 'Usable prototype'}</option>
                <option>{language === 'zh' ? '架构评估' : 'Architecture review'}</option>
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm text-[var(--text-soft)]">
            <span>{language === 'zh' ? '当前问题' : 'Current problem'}</span>
            <textarea
              className="min-h-32 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--text-strong)]"
              placeholder={language === 'zh' ? '简单说明你想自动化什么、卡在哪里、希望先看到什么结果。' : 'Briefly describe what you want automated, where it is blocked, and what outcome you want to see first.'}
              required
            />
          </label>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--text-soft)]">
              <span>{language === 'zh' ? '预计时间' : 'Timeline'}</span>
              <select className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--text-strong)]" required>
                <option>{language === 'zh' ? '1-2 周内想看到原型' : 'Prototype in 1-2 weeks'}</option>
                <option>{language === 'zh' ? '本月内推进' : 'Move this month'}</option>
                <option>{language === 'zh' ? '先做可行性判断' : 'Feasibility first'}</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-[var(--text-soft)]">
              <span>{language === 'zh' ? '联系方式' : 'Contact'}</span>
              <input
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-3 text-[var(--text-strong)]"
                type="text"
                placeholder={language === 'zh' ? '邮箱或微信' : 'Email or WeChat'}
                required
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-[var(--text-muted)]">
              {language === 'zh'
                ? '隐私说明：不会公开或转发你的信息，只用于判断需求与回复。'
                : 'Privacy: your details will not be published or forwarded, only used to assess and reply.'}
            </p>
            <button
              className="safe-touch rounded-xl bg-[var(--text-strong)] px-6 py-3 text-sm text-[var(--page-bg)]"
              type="submit"
              data-analytics-event="contact_form_submit"
            >
              {language === 'zh' ? '提交需求（24-48小时回复）' : 'Submit brief (24-48h reply)'}
            </button>
          </div>
          {submitted ? (
            <p className="rounded-xl border border-[var(--accent-soft)] bg-[var(--accent-wash)] px-4 py-3 text-sm text-[var(--text-strong)]">
              {language === 'zh'
                ? '已记录。你也可以直接发邮件到 hi@xiaotianaya.com，附上更多背景。'
                : 'Captured. You can also email hi@xiaotianaya.com with more context.'}
            </p>
          ) : null}
        </form>
      ) : null}
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
            Email
          </p>
          <a
            className="safe-touch mt-3 inline-block text-[var(--text-strong)]"
            href="mailto:hi@xiaotianaya.com"
            onClick={() => trackEvent('contact_email_click')}
          >
            hi@xiaotianaya.com
          </a>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
            GitHub
          </p>
          <a
            className="safe-touch mt-3 inline-block text-[var(--text-strong)]"
            href="https://github.com/MarcusDog"
            target="_blank"
            rel="noreferrer"
          >
            github.com/MarcusDog
          </a>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
            X (Twitter)
          </p>
          <a
            className="safe-touch mt-3 inline-block text-[var(--text-strong)]"
            href="https://x.com/Marcusdoggggg"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('contact_x_click')}
          >
            @Marcusdoggggg
          </a>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
            Instagram
          </p>
          <a
            className="safe-touch mt-3 inline-block text-[var(--text-strong)]"
            href="https://instagram.com/bemsdoggg"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('contact_instagram_click')}
          >
            @bemsdoggg
          </a>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
            WeChat
          </p>
          <p className="mt-3 text-[var(--text-strong)]">
            {language === 'zh' ? '邮件联系后提供' : 'Shared after email contact'}
          </p>
        </div>
        <div>
          <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
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
