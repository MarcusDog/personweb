import type { PropsWithChildren, ReactNode } from 'react'

import { PageTransition } from '../components/PageTransition'

interface ReadingLayoutProps extends PropsWithChildren {
  header: ReactNode
  footer: ReactNode
}

export function ReadingLayout({ children, header, footer }: ReadingLayoutProps) {
  return (
    <div className="theme-paper paper-noise min-h-screen bg-[var(--page-bg)] text-[var(--text-strong)]">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {header}
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      {footer}
    </div>
  )
}
