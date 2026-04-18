import { afterEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'

import App from '../App'
import { getJournalEntries, getProjects } from '../lib/content'

afterEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
})

async function renderRoute(path: string) {
  window.history.pushState({}, '', path)
  localStorage.setItem('personweb-language', 'zh')
  const container = document.createElement('div')
  document.body.appendChild(container)

  await act(async () => {
    createRoot(container).render(<App />)
  })
  for (let index = 0; index < 5; index += 1) {
    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 0))
    })
  }

  return container
}

describe('app shell', () => {
  it('renders one public brand and a specific home positioning statement', async () => {
    const container = await renderRoute('/')

    expect(container.textContent).toContain('小天Aya')
    expect(container.textContent).toContain('Aya')
    expect(container.textContent).not.toContain('BemsZzz')
    expect(container.textContent).toContain('Projects')
    expect(container.textContent).toContain('Journal')
    expect(container.textContent).toContain('把重复的工作自动化')
    expect(container.textContent).toContain('真正改变日常生活')
  })

  it('renders project and journal counts from data without template placeholders', async () => {
    await import('../pages/ProjectsPage')
    const projectsPage = await renderRoute('/projects')

    expect(projectsPage.textContent).toContain(`当前收录 ${getProjects().length} 个项目样例。`)
    expect(projectsPage.textContent).not.toContain('当前收录 $ 个项目样例')

    await import('../pages/JournalPage')
    const journalPage = await renderRoute('/journal')

    expect(journalPage.textContent).toContain(`当前收录 ${getJournalEntries().length} 篇文章样例。`)
    expect(journalPage.textContent).not.toContain('当前收录 $ 篇文章样例')
  })

  it('keeps the journal search visually secondary while the archive is small', async () => {
    const container = await renderRoute('/journal')

    expect(container.querySelector('[data-journal-tools="secondary"]')).toBeTruthy()
  })

  it('renders a not found state for unknown routes', async () => {
    const container = await renderRoute('/missing-route')

    expect(container.textContent).toContain('页面不存在')
  })
})
