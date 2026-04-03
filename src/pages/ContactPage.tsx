import { ContactPanel } from '../components/ContactPanel'
import { PageHero } from '../components/PageHero'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'

export function ContactPage() {
  const { language } = useLanguage()
  usePageTitle(
    language === 'zh'
      ? '联系 | 小天Aya｜BemsZzz'
      : 'Contact | XiaoTian Aya | BemsZzz',
  )

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={language === 'zh' ? '如果你在寻找一个更稳的合作入口。' : 'If you are looking for a steadier collaboration entry point.'}
        description={language === 'zh' ? '这里不是泛泛的联系方式页，而是一个面向商务合作、项目讨论与长期协作的入口。' : 'This is not a generic contact page, but a business-facing entry point for partnerships, project conversations, and longer collaboration arcs.'}
      />
      <section className="page-shell pb-20 md:pb-28">
        <ContactPanel language={language} />
      </section>
    </>
  )
}
