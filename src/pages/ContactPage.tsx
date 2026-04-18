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
        title={language === 'zh' ? '你有 idea，我来实现。' : 'You have the idea. I build it.'}
        description={language === 'zh' ? '不管想法是成型的还是随口一提的，都欢迎来聊。能不能做、怎么做 —— 先聊聊再说。' : "Doesn't matter what stage the idea is at — half-baked, fully formed, or just a task you want automated. Come talk."}
      />
      <section className="page-shell pb-20 md:pb-28">
        <ContactPanel language={language} />
      </section>
    </>
  )
}
