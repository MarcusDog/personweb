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
    expect(container.textContent).toContain('把 AI 想法做成可用系统')
    expect(container.textContent).toContain('真正改变日常生活')
    expect(container.textContent).toContain('预约需求拆解')
    expect(container.textContent).toContain('查看代表案例')
    expect(container.textContent).toContain('Agent 系统 / 自动化工具 / 产品原型')
    expect(container.querySelector('[data-analytics-event="hero_cta_click"]')).toBeTruthy()
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

  it('renders a structured contact intake form', async () => {
    await import('../pages/ContactPage')
    const container = await renderRoute('/contact')

    expect(container.textContent).toContain('你是谁')
    expect(container.textContent).toContain('当前问题')
    expect(container.textContent).toContain('期望交付')
    expect(container.textContent).toContain('预计时间')
    expect(container.textContent).toContain('联系方式')
    expect(container.textContent).toContain('提交需求（24-48小时回复）')
    expect(container.textContent).toContain('不会公开或转发你的信息')
    expect(container.querySelector('[data-analytics-event="contact_form_submit"]')).toBeTruthy()
  })

  it('shows result fields on project surfaces', async () => {
    await import('../pages/ProjectsPage')
    const container = await renderRoute('/projects')

    for (const project of getProjects()) {
      expect('result' in project).toBe(true)
    }
    expect(container.textContent).toContain('结果')
    expect(container.textContent).toContain('检索时间')
    expect(container.querySelector('[data-analytics-event="project_detail_click"]')).toBeTruthy()
  })

  it('connects articles back to consultation intent', async () => {
    await import('../pages/JournalArticlePage')
    const container = await renderRoute('/journal/durable-agent-systems')

    expect(container.textContent).toContain('如果你在做类似系统')
    expect(container.textContent).toContain('架构评估')
    expect(container.textContent).toContain('相关文章')
    expect(container.querySelector('[data-analytics-event="article_cta_click"]')).toBeTruthy()
  })

  it('summarizes fit and disqualification on the about page', async () => {
    await import('../pages/AboutPage')
    const container = await renderRoute('/about')

    expect(container.textContent).toContain('快速摘要')
    expect(container.textContent).toContain('如何合作')
    expect(container.textContent).toContain('不适合合作的情况')
  })

  it('renders a not found state for unknown routes', async () => {
    const container = await renderRoute('/missing-route')

    expect(container.textContent).toContain('页面不存在')
  })
})
