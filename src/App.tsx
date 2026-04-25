import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { ScrollToTop } from './components/ScrollToTop'
import { LanguageProvider } from './hooks/useLanguage'
import { useLanguage } from './hooks/useLanguage'
import { HomeLayout } from './layouts/HomeLayout'
import { ReadingLayout } from './layouts/ReadingLayout'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((module) => ({
    default: module.ProjectsPage,
  })),
)
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then((module) => ({
    default: module.ProjectDetailPage,
  })),
)
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((module) => ({
    default: module.JournalPage,
  })),
)
const JournalArticlePage = lazy(() =>
  import('./pages/JournalArticlePage').then((module) => ({
    default: module.JournalArticlePage,
  })),
)
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({
    default: module.AboutPage,
  })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({
    default: module.ContactPage,
  })),
)
const CommercialPage = lazy(() =>
  import('./pages/CommercialPage').then((module) => ({
    default: module.CommercialPage,
  })),
)

function RouteFallback() {
  const { language } = useLanguage()
  const isChinese = language === 'zh'

  return (
    <div className="page-shell pt-36 pb-20">
      <p className={`brand-ui text-[var(--text-muted)] ${isChinese ? 'text-[0.82rem] tracking-[0.08em]' : 'text-xs uppercase tracking-[0.12em]'}`}>
        {language === 'zh' ? '载入中' : 'Loading'}
      </p>
    </div>
  )
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <HomeLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <HomePage />
              </HomeLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <ProjectsPage />
                </LazyPage>
              </SiteLayout>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <ProjectDetailPage />
                </LazyPage>
              </SiteLayout>
            }
          />
          <Route
            path="/journal"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <JournalPage />
                </LazyPage>
              </SiteLayout>
            }
          />
          <Route
            path="/journal/:slug"
            element={
              <ReadingLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <JournalArticlePage />
                </LazyPage>
              </ReadingLayout>
            }
          />
          <Route
            path="/about"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <AboutPage />
                </LazyPage>
              </SiteLayout>
            }
          />
          <Route
            path="/commercial"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <CommercialPage />
                </LazyPage>
              </SiteLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <LazyPage>
                  <ContactPage />
                </LazyPage>
              </SiteLayout>
            }
          />
          <Route
            path="*"
            element={
              <SiteLayout
                header={<SiteHeader />}
                footer={<SiteFooter />}
              >
                <NotFoundPage />
              </SiteLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
