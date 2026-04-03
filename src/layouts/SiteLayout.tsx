import type { PropsWithChildren, ReactNode } from 'react'

import { PageTransition } from '../components/PageTransition'

interface SiteLayoutProps extends PropsWithChildren {
  header: ReactNode
  footer: ReactNode
}

export function SiteLayout({ children, header, footer }: SiteLayoutProps) {
  return (
    <div className="theme-paper min-h-screen bg-[var(--page-bg)] text-[var(--text-strong)]">
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
