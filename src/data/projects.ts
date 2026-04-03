import type { ProjectEntry } from '../types/content'

export const projects: ProjectEntry[] = [
  {
    slug: 'signal-ops-agent',
    featured: true,
    year: '2026',
    category: { zh: 'AI Agent / Workflow System', en: 'AI Agent / Workflow System' },
    title: { zh: 'Signal Ops Agent', en: 'Signal Ops Agent' },
    subtitle: {
      zh: '面向真实业务链路的多阶段信号整理与行动系统',
      en: 'A multi-stage signal triage and action system for real business workflows',
    },
    summary: {
      zh: '将分散的客户信号、内容输入与内部动作编排成可持续运转的 Agent 工作流。',
      en: 'An agent workflow that turns scattered customer signals, content inputs, and internal actions into durable operating loops.',
    },
    role: {
      zh: '产品策略、交互框架、工作流设计、前端体验与内容结构',
      en: 'Product strategy, interaction framing, workflow design, frontend experience, and content architecture',
    },
    capabilities: [
      { zh: '工作流拆解', en: 'Workflow decomposition' },
      { zh: 'Agent 提示与状态设计', en: 'Agent prompt and state design' },
      { zh: '结果面板与人工复核机制', en: 'Result surfaces and human review controls' },
    ],
    challenge: {
      zh: '原有流程依赖人工在多个工具间跳转，信息延迟与重复判断让团队难以放大处理规模。',
      en: 'The original process depended on humans jumping between tools, with delayed signals and repeated judgment calls limiting scale.',
    },
    approach: {
      zh: '以“信号进入、判断分层、动作分发、结果沉淀”四段重构系统，并为每一段设计清晰的人机边界。',
      en: 'The system was rebuilt around signal intake, layered judgment, action dispatch, and result retention, with explicit human-machine boundaries at each stage.',
    },
    outcome: {
      zh: '输出更稳定、响应路径更短，也让后续接入新数据源与新 Agent 模块变得可扩展。',
      en: 'It created more stable output, shorter response paths, and a cleaner base for new data sources and future agent modules.',
    },
    nextStep: {
      zh: '继续扩展跨渠道记忆层与协作审阅面板。',
      en: 'Next: expand the cross-channel memory layer and collaborative review surfaces.',
    },
    accent: 'from-[rgba(214,183,120,0.32)] via-[rgba(90,66,34,0.18)] to-transparent',
    detailSections: [
      {
        title: { zh: '项目背景', en: 'Background' },
        paragraphs: [
          {
            zh: '这个项目服务的是一个真实且持续变化的业务环境：线索来自邮件、表单、社媒与内容渠道，但判断与响应依然主要靠人手完成。',
            en: 'This project served a live business environment where leads arrived through email, forms, social channels, and publishing systems, while judgment and response still depended mostly on manual effort.',
          },
          {
            zh: '我没有把它定义成“做一个炫目的 AI 功能”，而是把它视作一套可以长期运转的信号操作系统。',
            en: 'Rather than framing it as a flashy AI feature, I treated it as a durable signal operating system.',
          },
        ],
      },
      {
        title: { zh: '问题与目标', en: 'Problem and Goal' },
        paragraphs: [
          {
            zh: '核心问题不是单点识别能力不足，而是输入杂乱、判断标准不统一、结果难以沉淀。目标是让 Agent 帮助团队更快进入“可行动状态”。',
            en: 'The core problem was not a lack of point intelligence, but chaotic inputs, inconsistent judgment criteria, and weak retention of outcomes. The goal was to move the team into an actionable state faster.',
          },
        ],
      },
      {
        title: { zh: '方案与过程', en: 'Approach and Process' },
        paragraphs: [
          {
            zh: '我先把流程拆成四层：采集、标准化、判断、分发。每层只处理一种职责，并为失败态准备可回退的人工处理通道。',
            en: 'I broke the system into collection, normalization, judgment, and dispatch. Each layer handled one job, and every failure mode had a clean path back to manual review.',
          },
          {
            zh: '界面设计上强调“少而准”的结果面板，让团队在最短路径内完成确认、补充与发送。',
            en: 'The UI was shaped around a sparse but precise result surface so the team could confirm, amend, and send within the shortest path possible.',
          },
        ],
      },
      {
        title: { zh: '最终结果', en: 'Outcome' },
        paragraphs: [
          {
            zh: '最终交付的不只是一个 Agent，而是一套可扩展的业务流程底座，它既能继续接新模型，也能接新角色和新内容来源。',
            en: 'The final delivery was not just an agent, but an extensible workflow base that can absorb new models, new roles, and new content sources over time.',
          },
        ],
      },
    ],
    gallery: [
      {
        label: { zh: 'Signal Intake', en: 'Signal Intake' },
        description: {
          zh: '统一收敛多渠道输入，并建立可追踪的进入队列。',
          en: 'A unified intake surface that consolidates multi-channel inputs into a traceable queue.',
        },
      },
      {
        label: { zh: 'Review Surface', en: 'Review Surface' },
        description: {
          zh: '将 Agent 判断结果压缩成可快速确认的审阅面板。',
          en: 'A compact review surface that turns agent output into fast confirmation decisions.',
        },
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
    nextStep: {
      zh: '补强多语言发布与知识图谱索引。',
      en: 'Next: strengthen multilingual publishing and graph-based indexing.',
    },
    accent: 'from-[rgba(201,154,87,0.22)] via-[rgba(120,84,39,0.14)] to-transparent',
    detailSections: [],
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
    nextStep: {
      zh: '加入案例匹配与报价建议层。',
      en: 'Next: add case matching and proposal guidance.',
    },
    accent: 'from-[rgba(175,135,77,0.18)] via-[rgba(74,51,26,0.14)] to-transparent',
    detailSections: [],
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
    nextStep: {
      zh: '继续测试跨项目引用与长期记忆压缩。',
      en: 'Next: test cross-project linking and long-term memory compression.',
    },
    accent: 'from-[rgba(155,123,76,0.18)] via-[rgba(58,45,30,0.12)] to-transparent',
    detailSections: [],
    gallery: [],
  },
]
