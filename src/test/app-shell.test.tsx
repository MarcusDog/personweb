import { describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import { act } from 'react'

import App from '../App'

describe('app shell', () => {
  it('renders the brand and primary navigation on the home route', () => {
    window.history.pushState({}, '', '/')
    localStorage.setItem('personweb-language', 'zh')
    const container = document.createElement('div')
    document.body.appendChild(container)

    act(() => {
      createRoot(container).render(<App />)
    })

    expect(container.textContent).toContain('小天')
    expect(container.textContent).toContain('Aya')
    expect(container.textContent).toContain('BemsZzz')
    expect(container.textContent).toContain('Projects')
    expect(container.textContent).toContain('Journal')
    expect(container.textContent).toContain('AI 产品与信息系统设计')
    expect(container.textContent).toContain('研究驱动，产品落地')
  })

  it('renders a not found state for unknown routes', () => {
    window.history.pushState({}, '', '/missing-route')
    localStorage.setItem('personweb-language', 'zh')
    const container = document.createElement('div')
    document.body.appendChild(container)

    act(() => {
      createRoot(container).render(<App />)
    })

    expect(container.textContent).toContain('页面不存在')
  })
})
