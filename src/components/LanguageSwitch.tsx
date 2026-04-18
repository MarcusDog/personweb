import { useLanguage } from '../hooks/useLanguage'
import { cn } from '../lib/utils'

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <div
      className="safe-touch inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-1 text-[0.72rem] uppercase tracking-[0.12em] text-[var(--text-muted)]"
      aria-label="Language switch"
    >
      {(['zh', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          className={cn(
            'safe-touch rounded-full px-3 py-2 transition duration-[240ms]',
            language === option
              ? 'bg-[var(--surface-strong)] text-[var(--text-strong)] shadow-[var(--shadow-soft)]'
              : 'hover:text-[var(--text-strong)]',
          )}
          onClick={() => setLanguage(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

