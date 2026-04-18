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
        title={language === 'zh' ? '先做一次需求拆解。' : 'Start with a short brief.'}
        description={language === 'zh' ? '不管想法是成型的还是随口一提的，先把问题、期望交付和时间说清楚，我会判断能不能做、怎么做。' : 'Whether the idea is formed or half-baked, send the problem, expected delivery, and timeline. I will assess what can be built and how.'}
      />
      <section className="page-shell pb-20 md:pb-28">
        <ContactPanel language={language} showForm />
      </section>
    </>
  )
}
