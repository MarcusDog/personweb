import { ContactPanel } from '../components/ContactPanel'
import { PageHero } from '../components/PageHero'
import { useLanguage } from '../hooks/useLanguage'
import { usePageTitle } from '../hooks/usePageTitle'

export function ContactPage() {
  const { language } = useLanguage()
  usePageTitle(
    language === 'zh'
      ? '联系 | 小天Aya'
      : 'Contact | XiaoTian Aya',
  )

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={language === 'zh' ? '来说说你在烦什么。' : 'Tell me what\'s been on your mind.'}
        description={language === 'zh' ? '想法成不成型都行。说出来，我来判断能不能做、值不值得做、该怎么做。' : 'Formed or not. Say it — I\'ll figure out whether it\'s doable, worth doing, and how to approach it.'}
      />
      <section className="page-shell pb-20 md:pb-28">
        <ContactPanel language={language} showForm />
      </section>
    </>
  )
}
