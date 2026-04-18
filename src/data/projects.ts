import type { LocalizedText, ProjectEntry, ProjectSection } from '../types/content'

function compactCaseSections(
  problem: LocalizedText,
  solution: LocalizedText,
  implementation: LocalizedText,
  result: LocalizedText,
): ProjectSection[] {
  return [
    {
      title: { zh: '问题背景', en: 'Problem Context' },
      paragraphs: [problem],
    },
    {
      title: { zh: '解决方案', en: 'Solution' },
      paragraphs: [solution],
    },
    {
      title: { zh: '技术实现', en: 'Implementation' },
      paragraphs: [implementation],
    },
    {
      title: { zh: '结果与指标', en: 'Result and Signals' },
      paragraphs: [result],
    },
  ]
}

export const projects: ProjectEntry[] = [
  {
    slug: 'ainews-platform',
    featured: true,
    year: '2026',
    category: { zh: 'AI 资讯平台 / Research Tool', en: 'AI Intelligence Platform / Research Tool' },
    title: { zh: 'Ainews', en: 'Ainews' },
    subtitle: {
      zh: '把高密度 AI 资讯流压缩成可跟踪、可分析、可检索的实时工作台',
      en: 'A real-time workspace that turns high-volume AI news into a trackable, analyzable, and searchable system',
    },
    summary: {
      zh: '聚合 50+ 中英文 AI 信源，结合实时推送、趋势分析、高级搜索、知识库与多样性评估，把分散信息源整理成一个更适合持续跟踪、横向比较和日常研究的产品界面。',
      en: 'A workspace that aggregates 50+ Chinese and English AI sources with real-time delivery, trend analysis, advanced search, glossary layers, and diversity scoring.',
    },
    role: {
      zh: '产品定义、信息架构、前后端实现、抓取链路与分析能力设计',
      en: 'Product framing, information architecture, full-stack implementation, ingestion pipeline design, and analytics surfaces',
    },
    capabilities: [
      { zh: '多源 RSS / API 聚合', en: 'Multi-source RSS and API aggregation' },
      { zh: '实时更新与自动恢复机制', en: 'Real-time updates and recovery logic' },
      { zh: '趋势分析与信息多样性评估', en: 'Trend analysis and diversity scoring' },
      { zh: '高级搜索与知识库设计', en: 'Advanced search and glossary design' },
    ],
    challenge: {
      zh: 'AI 资讯更新极快，论文、厂商博客、技术媒体和中文站点分散在不同渠道。普通订阅工具解决了“收集”，却很难解决“筛选、判断、持续跟踪”，更难把碎片内容整理成可复用的研究入口。',
      en: 'AI information moves across papers, company blogs, media outlets, and Chinese sources too quickly for generic feed readers to turn into usable judgment.',
    },
    approach: {
      zh: '项目采用“采集层、存储层、实时层、分析层、知识层”五段结构：前端提供资讯流、搜索、分析和术语解释，后端负责多源抓取、限流、缓存、SQLite 持久化与 WebSocket 推送。产品表达上则按“先稳定入口，再补足知识层，最后加上判断辅助”来展开。',
      en: 'The system is organized as ingestion, storage, realtime delivery, analytics, and knowledge layers, pairing a React workspace with a Node backend for fetch orchestration, caching, SQLite persistence, and WebSocket delivery.',
    },
    outcome: {
      zh: '最终交付的不只是一个 AI 新闻站，而是一套可持续更新的情报工作台。它把分散信源压缩成统一入口，也把“看新闻”升级成“追踪主题、比较信源、辅助判断、回看历史脉络”的连续动作。',
      en: 'The result is not just a news site, but a durable intelligence workspace for tracking themes, comparing sources, and making faster judgments over time.',
    },
    result: {
      zh: '50+ 信源统一聚合，信息检索时间从多站点跳转压缩到单一搜索入口。',
      en: '50+ sources consolidated into one workspace, reducing research lookup from multi-site switching to a single searchable surface.',
    },
    nextStep: {
      zh: '下一步会继续补强个性化订阅、信源权重机制、主题追踪订阅和正式部署后的子域名产品化包装，让它更接近一个可长期运营的独立产品。',
      en: 'Next: add personalized subscriptions, source weighting, and a cleaner production-ready packaging layer for subdomain deployment.',
    },
    accent: 'from-[rgba(214,183,120,0.32)] via-[rgba(90,66,34,0.18)] to-transparent',
    externalLinks: [
      {
        label: { zh: '访问 Ainews 平台', en: 'Visit Ainews Platform' },
        url: 'https://ainews.xiaotianaya.com',
      },
    ],
    detailSections: [
      {
        title: { zh: '项目定位', en: 'Positioning' },
        paragraphs: [
          {
            zh: 'Ainews 的出发点不是再做一个“把 RSS 堆在一起”的聚合页，而是做一个适合高频观察 AI 行业的人持续使用的工作台。它既要收得全，也要让用户更快看到哪些主题值得关注。',
            en: 'Ainews was framed less as another RSS reader and more as a working desk for people who need to stay close to AI developments at high frequency.',
          },
          {
            zh: '因此这个项目从一开始就同时关注信息密度、浏览效率和可运营性，而不是只做一个好看的前台页面。',
            en: 'That meant optimizing for information density, scanning speed, and operational durability instead of treating the interface as a purely visual exercise.',
          },
          {
            zh: '对外展示时，我更希望它被理解成一个“研究入口型产品”：首页负责接住高频浏览，分析页负责帮助判断，知识库负责承接长期学习，搜索负责让历史内容可以再次被调用。',
            en: 'The more useful framing is as a research entry product, where the feed handles daily scanning, analytics supports judgment, the glossary supports learning, and search keeps older material reusable.',
          },
        ],
      },
      {
        title: { zh: '系统设计', en: 'System Design' },
        paragraphs: [
          {
            zh: '后端以 Node.js + Express 搭建，围绕 50+ RSS 源和可选 API 源做抓取调度。源配置带有优先级、超时、限流和启停状态，抓取过程中加入了请求节流、失败重试、备用 RSS 解析、文件缓存与自动恢复，避免整条链路因为单点异常而失效。',
            en: 'The backend uses Node.js and Express to orchestrate 50+ RSS feeds plus optional API sources, with priorities, timeouts, throttling, retries, fallback parsing, file caching, and recovery logic built into the fetch layer.',
          },
          {
            zh: '数据层使用 SQLite 持久化，配合 WAL 模式、批量去重与请求日志，既保证本地部署足够轻，也让新闻、来源状态、用户偏好和认证会话都能稳定落库。',
            en: 'SQLite in WAL mode provides durable storage for articles, source health, user preferences, and auth sessions, while keeping deployment lightweight enough for a self-hosted tool.',
          },
          {
            zh: '这里的工程重点不是堆砌技术栈，而是让这套链路能稳定跑起来。对这种高频抓取型产品来说，恢复能力、缓存策略和源状态可见性，比单次请求速度更重要。',
            en: 'The engineering emphasis is durability rather than stack novelty. For a high-frequency ingestion product, recovery behavior, caching, and source visibility matter more than raw request speed.',
          },
        ],
      },
      {
        title: { zh: '产品亮点', en: 'Product Highlights' },
        paragraphs: [
          {
            zh: '前端不是单一列表页，而是围绕“持续跟踪”展开了多层入口：实时资讯流、系统状态面板、热门话题与趋势分析页、高级搜索、收藏、账户体系，以及 AI 术语知识库和架构导读页。',
            en: 'On the frontend, the product expands beyond a simple feed into a layered workspace with live news, system health, analytics, advanced search, favorites, accounts, and a glossary plus architecture guide.',
          },
          {
            zh: '其中比较有意思的一点，是我把“信息茧房”这个通常停留在概念层的话题，做成了可计算的多样性评分和推荐逻辑；同时又做了一层基于关键词提取的智能趋势分析，让资讯平台不只是展示内容，还能生成判断辅助。',
            en: 'One of the stronger product moves was turning “filter bubble” risk into a concrete diversity score and recommendation layer, alongside keyword-based trend analysis that helps the platform assist judgment instead of merely displaying content.',
          },
          {
            zh: '从产品表达上看，这些模块不是彼此割裂的功能点，而是围绕同一个任务展开：让用户更快完成“发现主题、理解背景、形成判断、回查资料”这一整条链路。',
            en: 'These modules are not isolated features. They all support the same user task: discover a theme, understand its context, form a view, and come back to the source material later.',
          },
        ],
      },
      {
        title: { zh: '核心创新', en: 'Key Innovations' },
        paragraphs: [
          {
            zh: '这个项目真正有辨识度的地方，不是“信源很多”，而是把资讯平台从被动浏览页做成了一个带判断辅助的工作界面。趋势分析、多样性评估和知识库这三层叠加起来，改变了用户消费信息的方式。',
            en: 'What makes the project distinctive is not just the number of feeds, but the shift from passive reading into a workspace with analytical support layers.',
          },
          {
            zh: '它同时覆盖“看新闻、找资料、学概念、做判断”四种使用场景，这让产品不只服务于资讯摄入，也服务于持续学习和研究型使用。',
            en: 'It supports reading, searching, learning, and evaluating in one system, which makes it useful as both an intelligence surface and a research-oriented learning product.',
          },
          {
            zh: '这也是它适合放进个人网站展示的原因。比起一个单点功能 demo，它更完整地体现了我在产品定义、信息架构、系统实现和展示表达上的综合能力。',
            en: 'That is also why the project works well in a portfolio: it shows product framing, information architecture, systems thinking, and presentation quality in one case.',
          },
        ],
      },
      {
        title: { zh: '工程取舍', en: 'Engineering Decisions' },
        paragraphs: [
          {
            zh: '项目里做了不少偏“系统稳定性”的细节：例如数据库为空时自动切换演示数据、WebSocket 驱动前端刷新、客户端本地缓存与防抖、服务状态面板、Docker 部署和 Nginx 反向代理预留。这些部分未必最显眼，但决定了它更像一个可持续运行的产品，而不是一次性的 demo。',
            en: 'A large part of the work went into durability details such as demo fallbacks, WebSocket-driven refresh, client-side caching and debouncing, a live status panel, and Docker plus reverse-proxy deployment paths.',
          },
          {
            zh: '换句话说，这个项目并不是只为截图而做。它在展示层之下，已经预留了比较完整的运行和部署思路，这也是我希望在案例页里明确讲出来的一点。',
            en: 'In other words, the product is not just screenshot-ready. Beneath the visual surface, it already carries a reasonably complete runtime and deployment model.',
          },
        ],
      },
    ],
    gallery: [
      {
        label: { zh: '分析控制台', en: 'Analytics Console' },
        description: {
          zh: '用热门话题、趋势判断、内容质量和多样性分析，把“看到了什么”进一步推进到“该怎么看”。',
          en: 'Hot topics, trend signals, quality checks, and diversity analysis shift the product from raw reading into guided interpretation.',
        },
        image: '/project-images/ainews/analytics.png',
      },
      {
        label: { zh: '架构导读', en: 'Architecture Guide' },
        description: {
          zh: '把模型架构、算法框架和训练方法做成可阅读、可对照的导读页，让资讯平台同时具备知识组织能力。',
          en: 'A long-form architecture guide gives the platform a deeper learning layer beyond daily news tracking.',
        },
        image: '/project-images/ainews/guide.png',
      },
      {
        label: { zh: '知识层', en: 'Knowledge Layer' },
        description: {
          zh: '通过术语知识库和模型架构导读，把资讯消费延伸到系统化理解，适合持续学习与对外展示。',
          en: 'A glossary and architecture guide extend the product from news consumption into structured understanding and long-term learning.',
        },
        image: '/project-images/ainews/glossary.png',
      },
      {
        label: { zh: '搜索入口', en: 'Search Surface' },
        description: {
          zh: '搜索与筛选页把新闻、术语和主题检索组织成更清晰的入口，适合高频查找与横向比对。',
          en: 'Search and filter surfaces make it easier to look up topics, compare coverage, and return to specific themes quickly.',
        },
        image: '/project-images/ainews/search.png',
      },
    ],
    showcaseGroups: [
      {
        afterSection: 'summary',
        eyebrow: { zh: '主界面', en: 'Core Surface' },
        title: {
          zh: '先把信息入口搭稳，再谈分析能力',
          en: 'Build a strong information surface before adding analytics',
        },
        description: {
          zh: '首页资讯流直接承担“高频浏览”的任务，分类切换、卡片密度和顶部入口都服务于快速扫读。项目不是先做复杂分析，而是先把用户每天会打开的主界面做好，让它真的能成为一个稳定入口。',
          en: 'The feed is designed for daily scanning first, with category routing and dense cards supporting repeated use before deeper analysis even begins.',
        },
        layout: 'single',
        items: [
          {
            image: '/project-images/ainews/1.png',
            title: { zh: '实时资讯流', en: 'Realtime Feed' },
            description: {
              zh: '项目首页用统一的新闻卡片承接多源内容，把论文、媒体、博客和中文站点压进同一套浏览语言里，让用户在第一屏就能进入连续浏览状态。',
              en: 'The home feed consolidates multi-source coverage into a single repeatable reading surface.',
            },
          },
        ],
      },
      {
        afterSection: 2,
        eyebrow: { zh: '内容组织', en: 'Content Structure' },
        title: {
          zh: '不仅有资讯流，也有更深一层的知识组织',
          en: 'The product expands beyond the feed into structured knowledge surfaces',
        },
        description: {
          zh: '这组页面体现的是平台的第二层能力：不是只把新闻聚合起来，而是继续把概念、结构和长内容解释组织成可学习的产品层。也就是说，用户不需要离开平台再去外部找解释和背景。',
          en: 'These surfaces show the second layer of the product: not just aggregation, but structured learning, concept framing, and long-form explanation.',
        },
        layout: 'feature-grid',
        items: [
          {
            image: '/project-images/ainews/4.png',
            title: { zh: '架构详解页', en: 'Architecture Guide' },
            description: {
              zh: '把模型架构和算法框架讲清楚，是这个项目区别于普通资讯站的重要一层。它让平台从“快速更新”延伸到“建立理解”。',
              en: 'The architecture guide turns the product into something more educational and durable than a standard news site.',
            },
          },
          {
            image: '/project-images/ainews/3.png',
            title: { zh: 'AI 知识库', en: 'AI Glossary' },
            description: {
              zh: '知识库首页负责承接检索、分类和概念入口，让读者可以从资讯直接转向系统化理解，也更适合做后续内容扩展。',
              en: 'The glossary provides an index into concepts, categories, and structured follow-up reading.',
            },
          },
          {
            image: '/project-images/ainews/2.png',
            title: { zh: '栏目化内容流', en: 'Category Surface' },
            description: {
              zh: '不同栏目有明确区分，用户可以按内容类型而不是单一时间线来消费信息，这让平台更接近一个有组织的内容系统，而不只是信息瀑布流。',
              en: 'Category-specific surfaces let users consume information by type, not only by chronology.',
            },
          },
        ],
      },
      {
        afterSection: 3,
        eyebrow: { zh: '判断辅助', en: 'Decision Support' },
        title: {
          zh: '把资讯平台做成带判断能力的工作界面',
          en: 'Turn a news platform into a workspace with judgment support',
        },
        description: {
          zh: '分析页是这个项目最有辨识度的一组界面。它把分类占比、来源分布、内容多样性和趋势热度拉到同一层，让平台从“展示内容”进一步走向“辅助理解”。这一层也是整个项目最接近研究工具气质的部分。',
          en: 'The analytics layer is the clearest differentiator: it brings distribution, diversity, and trend signals into one workspace to support interpretation.',
        },
        layout: 'two-up',
        items: [
          {
            image: '/project-images/ainews/6.png',
            title: { zh: '分析总览', en: 'Analytics Overview' },
            description: {
              zh: '总览页先给出整体分布，帮助用户快速理解平台当前的信息结构，适合在进入细分分析前先建立全局判断。',
              en: 'The overview panel gives a fast read on the current information shape of the platform.',
            },
          },
          {
            image: '/project-images/ainews/7.png',
            title: { zh: '图表分析', en: 'Chart Analysis' },
            description: {
              zh: '图表页把分类和来源做成更明确的可视化证据，适合横向比较，也更适合向外部展示这个产品并不只是一个普通内容页。',
              en: 'The chart view provides more explicit visual comparisons across categories and sources.',
            },
          },
          {
            image: '/project-images/ainews/8.png',
            title: { zh: '多样性评估', en: 'Diversity Scoring' },
            description: {
              zh: '信息茧房检测不是一句概念描述，而是被做成了平台里的实际评估能力。这一点直接提高了产品的辨识度。',
              en: 'Filter-bubble detection is implemented as a concrete scoring layer, not just a conceptual claim.',
            },
          },
          {
            image: '/project-images/ainews/9.png',
            title: { zh: '趋势分析', en: 'Trend Signals' },
            description: {
              zh: '趋势页把热词和变化方向提取出来，让资讯平台具备更接近研究工具的味道，也让“跟踪”这件事不再只依赖人工扫读。',
              en: 'Trend extraction pushes the product closer to a research tool than a conventional feed reader.',
            },
          },
        ],
      },
      {
        afterSection: 'outcome',
        eyebrow: { zh: '检索能力', en: 'Retrieval Layer' },
        title: {
          zh: '搜索不是附属功能，而是回到主题时的第二入口',
          en: 'Search acts as a second entry point back into the system',
        },
        description: {
          zh: '当平台内容量足够大后，搜索就不再是可有可无的补充，而是高频用户重新进入某个主题的主要路径。它让前面的资讯流、知识层和分析层真正形成闭环。',
          en: 'Once the archive grows, search becomes a primary way to re-enter a topic rather than a secondary utility.',
        },
        layout: 'single',
        items: [
          {
            image: '/project-images/ainews/5.png',
            title: { zh: '搜索结果页', en: 'Search Results' },
            description: {
              zh: '搜索结果页强调快速命中和结果回看，适合高频查找特定主题、模型或工具，也让这个平台更像一个可以回查的资料系统。',
              en: 'The search surface is built for fast recall of specific topics, models, and tools.',
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'learningbydoing-ai-studio',
    year: '2026',
    category: { zh: 'AI 学习产品 / Interactive Studio', en: 'AI Learning Product / Interactive Studio' },
    title: { zh: 'LearningByDoing AI Studio', en: 'LearningByDoing AI Studio' },
    subtitle: {
      zh: '把课程、代码实战、可视化讲解、面试训练与论文导入放进同一个学习工作台',
      en: 'A unified learning workspace that combines lessons, coding practice, visual explanation, interview drills, and paper import',
    },
    summary: {
      zh: '围绕“大模型从入门到专家”这条主线，把知识教学、面试模式、动手实战、AI 导师、论文学习和管理员发布流收进一套完整产品里，让学习不再停留在看课，而是进入可操作、可练习、可追踪的工作台状态。',
      en: 'An integrated learning studio built around a flagship LLM curriculum, combining teaching, interview practice, hands-on coding, an AI tutor, paper study, and an admin publishing flow in one product.',
    },
    role: {
      zh: '产品定义、课程结构设计、前后端实现、交互工作台设计与 AI 学习流整合',
      en: 'Product framing, curriculum structure design, full-stack implementation, workspace interaction design, and AI learning flow integration',
    },
    capabilities: [
      { zh: '多课程体系与章节工作台', en: 'Multi-track curriculum and chapter workspaces' },
      { zh: 'Python 运行沙盒与代码实战', en: 'Python runtime sandbox and coding practice' },
      { zh: 'AI 导师、面试训练与可视化讲解', en: 'AI tutor, interview drills, and visual teaching' },
      { zh: '论文导入与管理员发布流', en: 'Paper import and admin publishing flow' },
    ],
    challenge: {
      zh: '大多数 AI 学习产品把课程内容、代码练习、论文阅读和答疑拆在不同页面甚至不同工具里，用户只能在“看课”“抄代码”“查资料”之间反复跳转，很难形成真正连续的学习流。',
      en: 'Most AI learning products split lessons, coding, paper reading, and Q&A across separate tools, making it hard to sustain a continuous learning flow.',
    },
    approach: {
      zh: '项目采用单仓前后端结构，用 React + Vite 构建前端学习工作台，Express + TypeScript 提供课程、用户状态、论文导入、管理员草稿与 AI 服务聚合。产品上则把知识教学、面试模式、动手实战、论文学习和设置中心统一到同一导航体系里，让“学、练、问、查、回顾”在一个空间内完成。',
      en: 'The product uses a monorepo full-stack structure with a React workspace on the frontend and an Express + TypeScript backend for course data, user state, paper import, draft publishing, and AI service orchestration.',
    },
    outcome: {
      zh: '最终做出来的不是一个普通课程站，而是一个更接近学习操作系统的交互式产品。它把章节学习、代码运行、可视化理解、论文扩展和个性化设置接进同一条使用路径里，产品完整度明显高于单点型 demo。',
      en: 'The result is closer to an interactive learning operating system than a standard course site, with study, execution, explanation, paper extension, and personalization connected into one path.',
    },
    result: {
      zh: '5 条课程主线接入同一学习工作台，学习、练习、论文和 AI 辅导不再分散。',
      en: '5 curriculum tracks connected into one learning workspace, bringing lessons, practice, papers, and AI tutoring together.',
    },
    nextStep: {
      zh: '下一步会继续补强更多课程主线、真实 PDF 提取、学习进度分析和正式部署后的课程子域名包装，让它更接近一款可以长期运营的学习产品。',
      en: 'Next: expand the curriculum catalog, strengthen real PDF extraction, add learning analytics, and package it as a production-ready course product.',
    },
    accent: 'from-[rgba(143,168,255,0.24)] via-[rgba(76,98,180,0.14)] to-transparent',
    detailSections: [
      {
        title: { zh: '项目定位', en: 'Positioning' },
        paragraphs: [
          {
            zh: 'LearningByDoing AI Studio 的核心出发点，不是再做一个把课程视频或讲义排进去的学习站，而是做一个“能真正动手学”的学习工作台。学习者不只是阅读内容，而是要在同一界面里理解概念、改代码、看结果、问问题、再回到知识点。',
            en: 'The project was framed not as another lesson site, but as a learning workspace where understanding, coding, questioning, and reviewing happen in one place.',
          },
          {
            zh: '因此它更像一个交互式学习产品，而不是单纯的内容网站。平台真正想解决的问题，是把原本分散的学习动作压缩到一条连续路径里。',
            en: 'That makes it closer to an interactive product than a pure content site, with the goal of compressing fragmented learning actions into one continuous path.',
          },
          {
            zh: '对外展示时，这个项目最值得讲的点也正在这里: 它体现的不是某一个单独功能，而是完整的学习体验设计与系统组织能力。',
            en: 'For portfolio presentation, the strongest point is not any single feature, but the coherence of the full learning experience and system structure.',
          },
        ],
      },
      {
        title: { zh: '产品结构', en: 'Product Structure' },
        paragraphs: [
          {
            zh: '平台围绕五条课程主线展开，包括大模型、机器学习、Python、计算机网络和计算机组成；其中“大模型从入门到专家”是首发主线。每条主线又拆成章节，每章同时提供知识讲解、面试模式、动手实战、可视化步骤和练习入口。',
            en: 'The platform is organized around five curriculum tracks, with the flagship LLM course supported by chapter-level teaching, interview mode, hands-on practice, and visual explanations.',
          },
          {
            zh: '论文学习被单独抽成一个入口，不再混在课程章节页里。这样做的好处是，平台可以把课程内容和外部论文材料接起来，让“学课程”与“读原始资料”之间形成闭环。',
            en: 'Paper study is separated into its own surface, allowing the platform to connect course learning with external source material instead of mixing everything into chapter pages.',
          },
          {
            zh: '设置中心和学习记录也不是附属页面，而是这套产品的稳定层。它们让默认学习模式、面板布局、阅读密度和学习回放都变成可保存、可回到上次状态的长期使用能力。',
            en: 'Settings and learning history act as a stability layer, making mode preference, panel layout, reading density, and replay behavior persistent over time.',
          },
        ],
      },
      {
        title: { zh: '核心体验', en: 'Core Experience' },
        paragraphs: [
          {
            zh: '这个项目最有意思的地方，在于它没有把“教学”“练习”“答疑”拆成三套系统，而是把它们压进同一个工作台里。知识教学模式负责讲清概念，面试模式负责训练表达，动手实战模式负责把知识落到代码和终端结果上。',
            en: 'One of the strongest product decisions is treating teaching, practice, and explanation as one workspace rather than three disconnected systems.',
          },
          {
            zh: '在动手实战里，用户可以直接写 Python、运行代码、查看终端输出，并同步看到与当前代码高亮联动的结构化可视化；在需要的时候，还可以让 AI 导师基于当前上下文解释代码或知识点。这一套组合，比单纯放一个代码编辑器更像真实学习过程。',
            en: 'Hands-on mode combines Python editing, execution, terminal feedback, synchronized visualization, and contextual AI tutoring, making the experience closer to real study than a simple code editor.',
          },
          {
            zh: '面试模式也不是简单换一套皮肤，而是明确收窄界面，把重点集中到答题、提示和调试结果上。这个切换说明产品不是在堆页面，而是在为不同学习任务设计不同工作状态。',
            en: 'Interview mode is not just a visual variant; it narrows the interface to answer drafting, hints, and debug output, which reflects task-specific workspace design.',
          },
        ],
      },
      {
        title: { zh: '核心创新', en: 'Key Innovations' },
        paragraphs: [
          {
            zh: '这类项目真正难的地方，不是把课程内容列出来，而是把“抽象概念”变成“可操作学习动作”。LearningByDoing 通过知识页、可视化步骤、代码模板、终端反馈和 AI 导师，把这一层做得比普通课程产品更完整。',
            en: 'The distinctive move is turning abstract concepts into operational learning actions through teaching pages, visual steps, code templates, terminal feedback, and AI tutoring.',
          },
          {
            zh: '另外一个很有辨识度的点，是它把论文导入做成了学习流的一部分。导入 PDF、Markdown 或 TXT 后，系统会抽取摘要、方法步骤、关键公式和课程映射，这让平台不只是在“教既有课程”，也开始具备承接外部知识材料的能力。',
            en: 'Another strong differentiator is treating paper import as part of the learning flow, so external source material can be transformed into structured study surfaces inside the product.',
          },
          {
            zh: '再往后一层，管理员草稿生成与发布流则说明这套系统已经开始考虑内容生产端，而不只是面向学生端。这使得产品更像一个可以持续扩展的学习平台，而不是一次性作品。',
            en: 'The admin draft-generation and publishing flow also shows the system has started to account for content operations, not only learner-facing consumption.',
          },
        ],
      },
      {
        title: { zh: '工程实现', en: 'Engineering Implementation' },
        paragraphs: [
          {
            zh: '技术上，这个项目采用单仓前后端结构。前端使用 React 19、Vite、Tailwind、Monaco 和 Motion 来搭建多面板学习界面；后端使用 Express + TypeScript 管理课程、用户状态、管理员草稿与 AI 调用；代码运行则通过服务端 Python 沙盒承接。',
            en: 'Technically, the project uses a monorepo setup with React 19, Vite, Tailwind, Monaco, and Motion on the frontend, plus Express + TypeScript and a server-side Python sandbox on the backend.',
          },
          {
            zh: '这里真正重要的不是技术名词本身，而是它们被组织成了一套能支撑长期学习产品的结构：用户状态可保存、布局可记忆、课程与论文可扩展、AI provider 可切换、管理员内容可发布。这些细节共同决定了它更像一款产品，而不是一张概念图。',
            en: 'What matters is not the stack itself, but how it supports persistence, extensibility, provider switching, remembered layouts, and content operations like a real product.',
          },
        ],
      },
    ],
    gallery: [
      {
        label: { zh: '课程工作台', en: 'Learning Workspace' },
        description: {
          zh: '知识教学、面试训练和动手实战在同一界面中无缝切换，让学习流更连续。',
          en: 'Teaching, interview practice, and hands-on coding flow together in one workspace.',
        },
        image: '/project-images/learningbydoing/1.png',
      },
      {
        label: { zh: '动手实战', en: 'Hands-on Practice' },
        description: {
          zh: '代码编辑器、终端输出和可视化步骤并排展示，边学边做。',
          en: 'Code editor, terminal output, and visual steps displayed side by side.',
        },
        image: '/project-images/learningbydoing/5.png',
      },
      {
        label: { zh: 'AI 导师', en: 'AI Tutor' },
        description: {
          zh: '基于当前上下文的智能辅导，帮助理解代码和概念。',
          en: 'Context-aware AI tutoring to explain code and concepts.',
        },
        image: '/project-images/learningbydoing/8.png',
      },
      {
        label: { zh: '课程总览', en: 'Course Atlas' },
        description: {
          zh: '五条学习主线和章节结构清晰呈现，支持长期学习路径。',
          en: 'Five learning tracks with clear chapter structure for long-term study.',
        },
        image: '/project-images/learningbydoing/4.png',
      },
    ],
    externalLinks: [
      {
        label: { zh: '访问学习平台', en: 'Visit Learning Platform' },
        url: 'https://learning.xiaotianaya.com',
      },
    ],
    showcaseGroups: [
      {
        afterSection: 'summary',
        eyebrow: { zh: '课程总览', en: 'Course Atlas' },
        title: {
          zh: '先把课程主线搭清楚，再把学习动作接进来',
          en: 'Establish a clear curriculum atlas before layering in learning actions',
        },
        description: {
          zh: '总览页负责把五条学习主线和当前选中的课程路径先交代清楚，让用户知道这不是单章内容页，而是一套可以持续往下走的学习系统。',
          en: 'The atlas view frames the product as a multi-track learning system rather than a single isolated lesson page.',
        },
        layout: 'single',
        items: [
          {
            image: '/project-images/learningbydoing/4.png',
            title: { zh: '课程地图与学习路线', en: 'Curriculum Atlas and Roadmap' },
            description: {
              zh: '平台先给出课程主线、阶段结构和章节节奏，让后面的知识、练习和论文入口都有明确落点。',
              en: 'The curriculum atlas gives later lesson, practice, and paper flows a clear structural home.',
            },
          },
        ],
      },
      {
        afterSection: 1,
        eyebrow: { zh: '学习工作台', en: 'Learning Workspace' },
        title: {
          zh: '把知识教学、面试模式和动手实战压进同一套界面语言里',
          en: 'Bring teaching, interview mode, and hands-on practice into one workspace language',
        },
        description: {
          zh: '这组页面最能说明产品不是在堆功能，而是在设计不同学习状态。用户不需要离开当前章节，就可以在理解、表达和练习之间切换。',
          en: 'These screens show the product as a stateful workspace, where learners can move between understanding, articulation, and practice without leaving the chapter.',
        },
        layout: 'feature-grid',
        items: [
          {
            image: '/project-images/learningbydoing/1.png',
            title: { zh: '知识教学模式', en: 'Knowledge Teaching Mode' },
            description: {
              zh: '知识页不是简单讲义，而是把核心问题、学习目标和概念块组织成更适合逐步理解的教学界面。',
              en: 'The teaching surface structures core questions, goals, and concept blocks into a more legible learning interface.',
            },
          },
          {
            image: '/project-images/learningbydoing/2.png',
            title: { zh: '面试训练模式', en: 'Interview Practice Mode' },
            description: {
              zh: '面试模式主动收窄界面，只保留答题、提示和调试结果，让用户把注意力放在表达与推理上。',
              en: 'Interview mode narrows the UI around answer drafting, hints, and debugging to support articulation and reasoning.',
            },
          },
          {
            image: '/project-images/learningbydoing/5.png',
            title: { zh: '动手实战模式', en: 'Hands-on Practice Mode' },
            description: {
              zh: '实战模式把代码编辑、运行结果和可视化步骤并排组织起来，让“做出来”成为学习过程的一部分。',
              en: 'Practice mode puts editing, execution, and visualization side by side so building becomes part of the learning process.',
            },
          },
        ],
      },
      {
        afterSection: 2,
        eyebrow: { zh: '辅导与延展', en: 'Guidance and Extension' },
        title: {
          zh: '不仅能练，还能在练习过程中获得解释和外部知识延展',
          en: 'The product supports explanation during practice and extends into external source material',
        },
        description: {
          zh: '这两张图分别代表学习流向内和向外的延展: 一边是 AI 导师直接接入当前工作台，一边是把外部论文材料转成结构化学习页。',
          en: 'These two surfaces show both inward guidance through an AI tutor and outward extension through structured paper import.',
        },
        layout: 'two-up',
        items: [
          {
            image: '/project-images/learningbydoing/8.png',
            title: { zh: 'AI 导师侧栏', en: 'AI Tutor Sidebar' },
            description: {
              zh: 'AI 导师不是脱离上下文的聊天窗，而是贴着当前代码、步骤和学习任务提供解释与补充。',
              en: 'The AI tutor stays attached to the current code, step, and learning task instead of acting as an isolated chat box.',
            },
          },
          {
            image: '/project-images/learningbydoing/6.png',
            title: { zh: '论文导入页', en: 'Paper Import Surface' },
            description: {
              zh: '论文入口把 PDF、Markdown 和 TXT 转成结构化学习对象，让课程系统具备吸收外部资料的能力。',
              en: 'The paper import flow turns PDF, Markdown, and TXT into structured study objects connected back to the curriculum.',
            },
          },
        ],
      },
      {
        afterSection: 'outcome',
        eyebrow: { zh: '个性化与长期使用', en: 'Personalization and Retention' },
        title: {
          zh: '把设置、记录和工作台习惯做进产品底层',
          en: 'Build settings, history, and workspace habits into the product foundation',
        },
        description: {
          zh: '好的学习产品不只关心内容呈现，也关心长期使用。设置中心和学习记录让这套系统开始具备“回到上次状态继续学习”的产品感。',
          en: 'A serious learning product needs more than content presentation; settings and history make long-term return behavior possible.',
        },
        layout: 'single',
        items: [
          {
            image: '/project-images/learningbydoing/7.png',
            title: { zh: '设置与学习记录', en: 'Settings and Learning History' },
            description: {
              zh: '默认模式、布局记忆、阅读密度、代码字体和学习记录都被产品化处理，让平台更接近可长期使用的学习工具。',
              en: 'Mode preference, remembered layout, reading density, code font size, and learning history are treated as product-level capabilities.',
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'studio-publishing-loop',
    year: '2025',
    category: { zh: 'Content System', en: 'Content System' },
    title: { zh: 'Studio Publishing Loop', en: 'Studio Publishing Loop' },
    subtitle: {
      zh: '把研究、写作、发布和再利用连接成一个内容回路',
      en: 'Connecting research, writing, publishing, and reuse into a single editorial loop',
    },
    summary: {
      zh: '围绕长期写作与知识沉淀打造的内容操作界面与自动化流程。',
      en: 'An editorial operating interface and automation loop for long-term writing and knowledge retention.',
    },
    role: {
      zh: '内容架构、前端设计、工作流编排',
      en: 'Content architecture, frontend design, workflow orchestration',
    },
    capabilities: [
      { zh: '知识结构设计', en: 'Knowledge structuring' },
      { zh: '内容自动化', en: 'Content automation' },
      { zh: '前端阅读体验', en: 'Reading-focused frontend' },
    ],
    challenge: {
      zh: '内容在多个笔记、草稿和发布渠道之间断裂，难以形成真正可复用的知识资产。',
      en: 'Content was fragmented across notes, drafts, and publishing channels, making it hard to build reusable knowledge assets.',
    },
    approach: {
      zh: '先定义内容对象，再定义产出路径，最后用 Agent 补全整理与再利用环节。',
      en: 'The system defined content objects first, output paths second, and used agents to support refinement and reuse last.',
    },
    outcome: {
      zh: '形成从研究到成稿的更短路径，也让历史内容可以被再次调用。',
      en: 'It shortened the path from research to publishable draft and made historical content reusable.',
    },
    result: {
      zh: '把研究、草稿、发布、复用收进 1 条内容回路，减少重复整理成本。',
      en: 'Research, drafting, publishing, and reuse moved into one editorial loop, reducing repeated cleanup work.',
    },
    nextStep: {
      zh: '补强多语言发布与知识图谱索引。',
      en: 'Next: strengthen multilingual publishing and graph-based indexing.',
    },
    accent: 'from-[rgba(201,154,87,0.22)] via-[rgba(120,84,39,0.14)] to-transparent',
    detailSections: compactCaseSections(
      {
        zh: '长期写作最容易断在“研究、草稿、发布、复用”之间。每个平台都能存一点内容，但没有一条稳定路径把线索变成可发布、可回看、可再次调用的资产。',
        en: 'Long-term writing tends to break between research, drafting, publishing, and reuse. Each tool can store a fragment, but the full path from signal to reusable asset is rarely stable.',
      },
      {
        zh: '这个项目把内容先建模为对象，再把研究线索、草稿状态、发布渠道和后续复用放进同一个操作回路，让内容不再只是一篇篇孤立文章。',
        en: 'The solution modeled content as reusable objects first, then connected research signals, draft status, publishing channels, and later reuse into one editorial loop.',
      },
      {
        zh: '前端以阅读和操作两种状态组织，后台流程用自动摘要、标签建议和发布检查减少人工整理成本。重点不是生成更多文字，而是缩短从研究到成稿的路径。',
        en: 'The interface separates reading and operating states, while automation handles summarization, tag suggestions, and publishing checks to reduce manual editorial overhead.',
      },
      {
        zh: '结果是内容从“写完就结束”变成“写完还能继续被调用”。衡量标准不是文章数量，而是旧研究能否在新项目里再次发挥作用。',
        en: 'The result shifts content from one-off output into reusable context. The key signal is not volume, but whether old research can become useful again in new work.',
      },
    ),
    gallery: [],
  },
  {
    slug: 'partner-brief-agent',
    year: '2025',
    category: { zh: 'Business Interface', en: 'Business Interface' },
    title: { zh: 'Partner Brief Agent', en: 'Partner Brief Agent' },
    subtitle: {
      zh: '将合作需求快速压缩成可判断、可回复的商务摘要',
      en: 'Compressing inbound collaboration requests into clear, reply-ready briefs',
    },
    summary: {
      zh: '面向合作入口设计的 Agent 摘要与分流系统。',
      en: 'An agent-powered summarization and routing layer for inbound partnership requests.',
    },
    role: {
      zh: '信息结构、交互策略、前端实现',
      en: 'Information architecture, interaction strategy, frontend implementation',
    },
    capabilities: [
      { zh: '合作表单策略', en: 'Inquiry design' },
      { zh: '摘要生成', en: 'Brief generation' },
      { zh: '商务优先级分流', en: 'Priority routing' },
    ],
    challenge: {
      zh: '合作请求往往信息不完整，人工前置整理成本高。',
      en: 'Partnership requests often arrive incomplete, making manual triage expensive.',
    },
    approach: {
      zh: '通过结构化收集与 Agent 摘要，把第一轮判断时间压缩到可接受范围。',
      en: 'Structured intake plus agent briefing reduced the cost of first-round evaluation.',
    },
    outcome: {
      zh: '显著提高了合作请求的判断效率与回复质量。',
      en: 'It improved both evaluation speed and response quality for inbound collaboration.',
    },
    result: {
      zh: '把模糊咨询压缩成结构化 brief，第一轮判断从追问信息变成直接评估。',
      en: 'Vague inquiries become structured briefs, moving first-round triage from clarification to evaluation.',
    },
    nextStep: {
      zh: '加入案例匹配与报价建议层。',
      en: 'Next: add case matching and proposal guidance.',
    },
    accent: 'from-[rgba(175,135,77,0.18)] via-[rgba(74,51,26,0.14)] to-transparent',
    detailSections: compactCaseSections(
      {
        zh: '合作入口的问题不是没有人联系，而是信息常常不完整：需求、预算、时间、目标用户和技术约束散落在几句话里，第一轮判断成本很高。',
        en: 'Inbound collaboration requests often arrive incomplete, with goals, constraints, timeline, budget, and user context scattered across a few vague sentences.',
      },
      {
        zh: '系统通过结构化收集和 Agent 摘要，把模糊请求整理成可判断的 brief，并给出优先级、缺失信息和下一步回复建议。',
        en: 'The system combines structured intake with agent-generated briefs, turning vague requests into evaluation-ready summaries with priority, missing information, and reply suggestions.',
      },
      {
        zh: '实现上把表单字段、自由描述和历史案例拆成独立输入，再由摘要层压缩成商务判断视图。前端强调快速扫读，避免把合作入口做成复杂 CRM。',
        en: 'Implementation separates form fields, free-text context, and case references before compressing them into a business-facing review surface designed for quick scanning.',
      },
      {
        zh: '结果是第一轮判断从“重新追问一遍”变成“先看结构化摘要再回复”。核心指标是回复质量和判断速度，而不是自动化炫技。',
        en: 'The result turns first-round triage from repeated clarification into structured review before reply. The important signals are response quality and evaluation speed.',
      },
    ),
    gallery: [],
  },
  {
    slug: 'research-memory-index',
    year: '2024',
    category: { zh: 'Research Tooling', en: 'Research Tooling' },
    title: { zh: 'Research Memory Index', en: 'Research Memory Index' },
    subtitle: {
      zh: '为研究型工作构建更可靠的上下文记忆层',
      en: 'A more reliable contextual memory layer for research-driven work',
    },
    summary: {
      zh: '围绕研究记录、线索链接与后续调用设计的记忆索引原型。',
      en: 'A memory indexing prototype for research notes, linked signals, and later retrieval.',
    },
    role: {
      zh: '研究框架、信息模型、原型实现',
      en: 'Research framing, information modeling, prototype implementation',
    },
    capabilities: [
      { zh: '信息建模', en: 'Information modeling' },
      { zh: '知识检索界面', en: 'Knowledge retrieval surfaces' },
      { zh: 'Agent context design', en: 'Agent context design' },
    ],
    challenge: {
      zh: '研究过程中的上下文很容易碎裂，后续调用时缺乏可信结构。',
      en: 'Research context fragments quickly and becomes hard to reuse with confidence later.',
    },
    approach: {
      zh: '用对象化结构代替纯时间线笔记，再用检索与摘要帮助后续 Agent 调用。',
      en: 'Object-based memory replaced timeline notes, with retrieval and summarization supporting later agent use.',
    },
    outcome: {
      zh: '让长期研究项目具备更稳定的上下文连续性。',
      en: 'It created stronger continuity for long-running research work.',
    },
    result: {
      zh: '用对象化索引保留研究上下文，再次进入项目时能更快恢复判断。',
      en: 'Object-based indexes preserve research context so judgment can be restored faster when returning to a project.',
    },
    nextStep: {
      zh: '继续测试跨项目引用与长期记忆压缩。',
      en: 'Next: test cross-project linking and long-term memory compression.',
    },
    accent: 'from-[rgba(155,123,76,0.18)] via-[rgba(58,45,30,0.12)] to-transparent',
    detailSections: compactCaseSections(
      {
        zh: '研究型项目最容易丢失的是上下文：为什么记录这条线索、它和哪个问题相关、后续 Agent 应该如何调用，单纯时间线笔记很快会失效。',
        en: 'Research projects lose context quickly: why a signal mattered, which question it connects to, and how a later agent should reuse it are not preserved by timeline notes alone.',
      },
      {
        zh: '这个原型把研究记录改成对象化索引：线索、问题、来源、结论和下一步动作彼此连接，后续检索时可以按问题而不是按时间回到上下文。',
        en: 'The prototype turns research notes into object-based indexes linking signals, questions, sources, conclusions, and next actions so retrieval can happen by problem rather than date.',
      },
      {
        zh: '实现重点是信息模型和检索界面：先定义对象关系，再用摘要和标签作为 Agent 上下文压缩层，减少每次重新阅读历史材料的成本。',
        en: 'The implementation focuses on the information model and retrieval surface, using summaries and tags as a context-compression layer for later agent work.',
      },
      {
        zh: '结果是长期研究更容易保持连续性。衡量标准是再次进入项目时能否快速恢复判断，而不是笔记库里堆了多少条记录。',
        en: 'The result is stronger continuity for long-running research. The useful metric is how quickly judgment can be restored when returning to a project.',
      },
    ),
    gallery: [],
  },
]
