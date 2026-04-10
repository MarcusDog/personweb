import { describe, expect, it } from 'vitest'

import {
  extractMarkdownHeadings,
  parseBilingualMarkdown,
} from '../lib/markdown'

describe('bilingual markdown parsing', () => {
  const source = `---
slug: durable-agents
date: 2026-03-31
categoryZh: 方法
categoryEn: Practice
titleZh: 构建可持续的智能体系统
titleEn: Building Durable Agent Systems
standfirstZh: 一篇关于系统边界与交付的方法笔记。
standfirstEn: Notes on boundaries and delivery for agent systems.
---
<!--lang:zh-->
## 结构先于工具

中文正文

### 工作流

继续说明

<!--lang:en-->
## Structure Before Tools

English body
`

  it('splits frontmatter and localized blocks', () => {
    const parsed = parseBilingualMarkdown(source)

    expect(parsed.frontmatter.slug).toBe('durable-agents')
    expect(parsed.zh).toContain('结构先于工具')
    expect(parsed.en).toContain('Structure Before Tools')
  })

  it('extracts heading outlines from localized markdown', () => {
    const headings = extractMarkdownHeadings(parseBilingualMarkdown(source).zh)

    expect(headings).toEqual([
      { depth: 2, text: '结构先于工具', id: '结构先于工具' },
      { depth: 3, text: '工作流', id: '工作流' },
    ])
  })
})

