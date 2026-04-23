import type { PropsWithChildren, ReactNode } from 'react'

import { PageTransition } from '../components/PageTransition'
import { Prelude } from '../components/Prelude'

interface HomeLayoutProps extends PropsWithChildren {
  header: ReactNode
  footer: ReactNode
}

export function HomeLayout({ children, header, footer }: HomeLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bloom-bg)] text-[var(--bloom-text)]">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Prelude />
      {header}
      <main id="main-content">
        <PageTransition>{children}</PageTransition>
      </main>
      {footer}
    </div>
  )
}
