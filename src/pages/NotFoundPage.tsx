import { Link } from 'react-router-dom'

import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFoundPage() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'

  usePageTitle(
    language === 'zh' ? '页面不存在 | 小天Aya｜BemsZzz' : 'Page Not Found | XiaoTian Aya | BemsZzz',
  )

  return (
    <section className="page-shell pt-36 pb-24 md:pt-44">
      <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.8rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.28em]'}`}>
        404
      </p>
      <h1 className={`brand-display mt-5 text-[var(--text-strong)] ${isChinese ? 'text-[3rem] leading-[1.04] md:text-[4.8rem]' : 'text-5xl leading-[0.92] md:text-7xl'}`}>
        {language === 'zh' ? '页面不存在' : 'Page not found'}
      </h1>
      <p className={`mt-6 max-w-2xl text-[var(--text-soft)] ${isChinese ? 'text-[1.06rem] leading-[1.9]' : 'text-lg leading-8'}`}>
        {language === 'zh'
          ? '这个地址没有对应内容。你可以返回首页，或者继续查看项目与文章。'
          : 'There is no content at this address. You can return home or continue into the projects and journal.'}
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          className={`safe-touch inline-flex items-center rounded-full border border-[var(--border-subtle)] px-5 py-3 text-sm text-[var(--text-strong)] ${isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'}`}
          to="/"
        >
          {language === 'zh' ? '返回首页' : 'Back home'}
        </Link>
        <Link
          className={`safe-touch inline-flex items-center rounded-full border border-[var(--border-subtle)] px-5 py-3 text-sm text-[var(--text-strong)] ${isChinese ? 'tracking-[0.08em]' : 'uppercase tracking-[0.24em]'}`}
          to="/projects"
        >
          Projects
        </Link>
      </div>
    </section>
  )
}
