import { useLanguage } from '../hooks/useLanguage'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  const { language } = useLanguage()
  const isChinese = language === 'zh'

  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p
          className={`brand-ui mb-4 text-[var(--text-muted)] ${
            isChinese
              ? 'text-[0.82rem] tracking-[0.08em]'
              : 'text-xs uppercase tracking-[0.32em]'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`brand-display balance text-[var(--text-strong)] ${
          isChinese
            ? 'text-[2.6rem] leading-[1.04] md:text-[4rem]'
            : 'text-4xl leading-[0.96] md:text-5xl'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-5 text-[var(--text-soft)] ${
            isChinese ? 'text-[1.08rem] leading-[1.95]' : 'text-lg leading-8'
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
