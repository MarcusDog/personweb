import type { ProjectEntry } from '../types/content'

function compactProject(project: Omit<ProjectEntry, 'gallery' | 'showcaseGroups'>): ProjectEntry {
  return { ...project, gallery: [], showcaseGroups: [] }
}

export const projects: ProjectEntry[] = [
  {
    slug: 'shizaolu',
    featured: true,
    year: '2026',
    category: { zh: '微信小程序 / 烹饪工具', en: 'WeChat Mini Program / Cooking Tool' },
    title: { zh: '食灶录', en: 'Shizaolu' },
    subtitle: {
      zh: '给真正站在灶台前的人做的菜谱、跟做与成长记录工具',
      en: 'A recipe, guided-cooking, and progress journal built for people who are actually standing at the stove',
    },
    summary: {
      zh: '我做食灶录，是因为普通菜谱在真正开火以后并不好用。手上有水有油，页面还在不断滚；一句“适量”，对新手也没有多少帮助。于是我把它做成微信小程序，把备料、分步跟做、计时、火候、语音播报和做完后的日记连在一起。',
      en: 'Most recipe apps become awkward once cooking actually starts. Shizaolu links preparation, step-by-step guidance, timers, heat cues, spoken instructions, and a post-cooking journal in one WeChat mini program.',
    },
    role: {
      zh: '独立完成产品定义、交互设计、微信小程序开发、云开发数据层、菜谱清洗与展示素材整理',
      en: 'Independent product definition, interaction design, mini-program development, cloud data layer, recipe cleanup, and visual production',
    },
    capabilities: [
      { zh: '沉浸式分步做菜', en: 'Guided cooking mode' },
      { zh: '摇一摇切步与语音播报', en: 'Hands-free step control and TTS' },
      { zh: '冰箱食材匹配', en: 'Ingredient matching' },
      { zh: '菜谱解析与云端同步', en: 'Recipe parsing and cloud sync' },
    ],
    challenge: {
      zh: '难点不在把菜谱放进列表，而在做菜过程中还能顺手使用。新手需要知道先准备什么、现在开多大火、还要等多久；双手不方便碰手机时，界面还得继续往前走。',
      en: 'The hard part was not listing recipes. It was keeping the product usable while both hands were busy and a beginner still needed clear preparation, heat, and timing cues.',
    },
    approach: {
      zh: '我把主流程收成“备料清单 → 单步跟做 → 完成记录”。每一步会从文本里找出相关食材和火候，带时间的步骤直接启动倒计时；摇一摇可以切到下一步，TTS 会读出当前说明。数据层同时支持本地存储和微信云开发，没配云环境也能完整运行。',
      en: 'The main flow is preparation, one-step-at-a-time cooking, and a completion record. Steps surface the relevant ingredients, heat, and timer; shake gestures and TTS keep the flow moving hands-free. The data layer works locally and can switch to WeChat Cloud Development.',
    },
    outcome: {
      zh: '现在它已经不是菜谱展示页，而是一套能从“今天吃什么”一路走到“这次做得怎么样”的完整工具。冰箱推荐、收藏、图鉴和成长日记也都围绕这条主线服务。',
      en: 'It grew from a recipe browser into a complete path from deciding what to cook to recording how the attempt went, with fridge matching, favorites, a collection, and a cooking journal around that core.',
    },
    result: {
      zh: '完成 v4.0 可运行版本；清洗约 5 万条原始菜谱，形成 3.9 万余条结构化数据，并把核心菜谱、图片与云端初始化链路接入小程序。',
      en: 'Delivered a runnable v4.0 and a data pipeline that cleaned roughly 50,000 raw recipes into more than 39,000 structured records, with curated recipes and cloud seeding connected to the mini program.',
    },
    nextStep: {
      zh: '下一步会把真实用户在做菜时的停顿、回退和失败点记录下来，再决定哪些提示该留下，哪些应该删掉。',
      en: 'Next, I want to observe where real cooks pause, go back, or abandon a step, then simplify the guidance around those moments.',
    },
    accent: 'from-[rgba(245,112,54,0.26)] via-[rgba(239,171,79,0.11)] to-transparent',
    detailSections: [
      {
        title: { zh: '先解决灶台上的使用问题', en: 'Designing for the stove, not the sofa' },
        paragraphs: [
          {
            zh: '我最先做的不是首页，而是跟做模式。因为用户一旦已经开始炒菜，漂亮的推荐卡片就没用了。他需要一眼看懂这一小步，需要计时，也可能因为手上沾着东西没法触屏。摇一摇切步做了 1.5 秒防抖，并配合震动反馈；语音播报只读当前步骤，不在厨房里制造更多信息。',
            en: 'I started with cooking mode rather than the home screen. Once the pan is hot, recommendation cards stop mattering. The user needs one clear step, a timer, and a way to move forward without touching the screen. Shake-to-advance uses a 1.5-second debounce with haptic feedback, while TTS reads only the current instruction.',
          },
        ],
      },
      {
        title: { zh: '冰箱推荐不是“有就算匹配”', en: 'Ingredient matching needs useful penalties' },
        paragraphs: [
          {
            zh: '冰箱推荐按核心食材命中、缺失核心食材、缺少调料和难度一起算分。这样番茄和鸡蛋都齐全时，番茄炒蛋会自然排在前面；只差一味调料的菜也不会被完全排除。结果页直接告诉用户“还差什么”，比给一个没有解释的百分数更实用。',
            en: 'Recommendations score core ingredient matches, missing essentials, missing seasonings, and difficulty together. A dish with both tomato and egg rises naturally, while something missing one seasoning is not discarded. The result also says what is missing instead of leaving the user with an unexplained percentage.',
          },
        ],
      },
      {
        title: { zh: '让录菜谱这件事没那么累', en: 'Lowering the cost of adding a recipe' },
        paragraphs: [
          {
            zh: '自建菜谱支持从现有菜谱复制再改，也能把外部教程文本贴进解析器。解析器会提取菜名、食材、用量和步骤，再推断分类、耗时与难度。它不会替用户决定所有内容，但先把重复录入做掉，剩下的只需要校对。',
            en: 'A personal recipe can start from a copy of an existing one or from pasted tutorial text. The parser extracts the title, ingredients, quantities, and steps, then suggests category, time, and difficulty. It does not make every decision; it removes the repetitive entry work and leaves the user to review.',
          },
        ],
      },
      {
        title: { zh: '本地可用，云端可选', en: 'Local by default, cloud when useful' },
        paragraphs: [
          {
            zh: '微信云开发负责菜谱、图片和跨设备图鉴，但它不是启动条件。没有配置云环境时，统一数据层会回退到本地存储，测试号也能把主要流程走完。云函数写入做了幂等和断点续传，批量导入时不需要担心重复数据。',
            en: 'WeChat Cloud Development handles recipes, images, and cross-device collections, but it is not a startup requirement. Without cloud configuration, the shared data layer falls back to local storage so a test account can still complete the main flow. Cloud seeding is idempotent and resumable.',
          },
        ],
      },
    ],
    gallery: [],
    showcaseGroups: [
      {
        afterSection: 'summary',
        eyebrow: { zh: '真实界面', en: 'Product UI' },
        title: { zh: '从家里有什么，到今天能做什么', en: 'From what is in the fridge to what can be cooked' },
        description: { zh: '真实项目里的冰箱管理与食材推荐界面。橙色承担行动提示，绿色只用来表达已有食材和可用状态。', en: 'The real fridge and recommendation screens. Orange carries actions; green is reserved for available ingredients and ready states.' },
        layout: 'two-up',
        items: [
          { image: '/project-images/shizaolu/fridge.png', title: { zh: '我的冰箱', en: 'My Fridge' }, description: { zh: '管理常备食材、快速勾选库存，并直接进入推荐。', en: 'Manage staples, select current stock, and move straight into recommendations.' } },
          { image: '/project-images/shizaolu/recommend.png', title: { zh: '食材推荐', en: 'Ingredient Recommendations' }, description: { zh: '按匹配度排序，并把缺少的食材直接写出来。', en: 'Ranked by fit, with missing ingredients shown directly.' } },
        ],
      },
      {
        afterSection: 1,
        eyebrow: { zh: '留存与创作', en: 'Retention and creation' },
        title: { zh: '做完以后，内容还会留下来', en: 'The work remains useful after the meal' },
        description: { zh: '收藏、自建菜谱和成长日记把一次做菜变成可回看的个人记录。', en: 'Favorites, personal recipes, and the cooking journal turn one meal into a record worth returning to.' },
        layout: 'feature-grid',
        items: [
          { image: '/project-images/shizaolu/diary.png', title: { zh: '成长日记', en: 'Cooking Journal' }, description: { zh: '按时间记录菜品、照片、心情和连续做菜天数。', en: 'A timeline of dishes, photos, moods, and cooking streaks.' } },
          { image: '/project-images/shizaolu/recipe-create.png', title: { zh: '创建菜谱', en: 'Create Recipe' }, description: { zh: '食材、调料和步骤拆开编辑，减少长表单的压力。', en: 'Ingredients, seasonings, and steps are edited separately to keep the form manageable.' } },
          { image: '/project-images/shizaolu/favorites.png', title: { zh: '我的收藏', en: 'Favorites' }, description: { zh: '把经常做和准备尝试的菜收在一起。', en: 'Keep repeat dishes and things to try in one place.' } },
        ],
      },
    ],
  },
  {
    slug: 'voicedesk',
    featured: true,
    year: '2026',
    category: { zh: 'Windows 桌面应用 / 本地 AI', en: 'Windows Desktop / Local AI' },
    title: { zh: 'VoiceDesk', en: 'VoiceDesk' },
    subtitle: {
      zh: '把录音、转写、校对和文档整理收进一个本地优先的工作台',
      en: 'A local-first workspace for recording, transcription, review, and structured documents',
    },
    summary: {
      zh: 'VoiceDesk 处理的是语音转文字之后那一大段没人愿意做的工作：找低置信度片段、改名字、跳回原音频、整理章节，再把转写变成会议纪要或行动清单。音频、转写和项目数据默认留在本机。',
      en: 'VoiceDesk focuses on the work after speech-to-text: reviewing low-confidence spans, naming speakers, jumping back to audio, organizing chapters, and turning a transcript into a meeting note or action list. Audio and project data stay local by default.',
    },
    role: {
      zh: '独立完成产品蓝图、桌面端交互、React 前端、Tauri / Rust 核心、SQLite 数据层与 Python ASR sidecar',
      en: 'Independent product blueprint, desktop UX, React frontend, Tauri/Rust core, SQLite layer, and Python ASR sidecar',
    },
    capabilities: [
      { zh: '本地录音与批量导入', en: 'Local recording and batch import' },
      { zh: 'faster-whisper 本地转写', en: 'Local faster-whisper transcription' },
      { zh: '可追溯校对工作区', en: 'Traceable review workspace' },
      { zh: '本地 / 在线 AI 文档', en: 'Local and hosted AI documents' },
    ],
    challenge: {
      zh: '转写工具往往在输出一段文字后就结束了，但真正要交付的通常是整理好的会议纪要、访谈洞察或可继续编辑的文档。中间的校对、定位和结构化如果没有被设计好，用户还是得换回播放器和文档软件来回找。',
      en: 'Most transcription tools stop at raw text, while the actual deliverable is usually a reviewed meeting note, interview insight, or editable document. Without a designed review flow, users still bounce between a player and a document editor.',
    },
    approach: {
      zh: '桌面端用 Tauri 2 承载 React 界面，Rust 管理 SQLite、文件与可恢复任务状态；Python sidecar 跑 faster-whisper / CTranslate2。转写段落保留时间戳和置信度，点击文本能回到原音频。AI 文档既可以调用在线模型，也可以走 Qwen3 + llama.cpp 的离线备用链路。',
      en: 'Tauri 2 hosts the React interface, while Rust manages SQLite, files, and recoverable task state. A Python sidecar runs faster-whisper/CTranslate2. Transcript segments preserve timestamps and confidence, and generated documents can use either a hosted model or a local Qwen3/llama.cpp fallback.',
    },
    outcome: {
      zh: '应用已经形成“导入或录音 → 转写 → 校对 → 结构化文档 → 导出”的闭环，并打包为 Windows NSIS 安装器。界面不是把模型能力堆在一起，而是围绕一份声音材料从进入到可交付的过程来组织。',
      en: 'The app now covers import or recording, transcription, review, structured document generation, and export, and ships as a Windows NSIS installer. The interface is organized around the life of one recording rather than a pile of model features.',
    },
    result: {
      zh: '交付 v0.5.0 Windows 个人版；前端构建、Python 与 Rust 测试通过，并完成多档桌面宽度的回归检查。',
      en: 'Delivered the v0.5.0 Windows personal edition with frontend, Python, and Rust checks passing plus multi-width desktop regression coverage.',
    },
    nextStep: {
      zh: '继续用真实长录音验证说话人、低置信度校对和大文件恢复，减少只在演示数据上成立的体验。',
      en: 'Next is more validation with long real recordings, especially speaker review, low-confidence correction, and recovery from large-file failures.',
    },
    accent: 'from-[rgba(51,91,132,0.24)] via-[rgba(184,151,91,0.10)] to-transparent',
    externalLinks: [
      { label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/VoiceDesk' },
    ],
    detailSections: [
      {
        title: { zh: '我不想再做一个“点一下等结果”的转写器', en: 'More than a one-button transcriber' },
        paragraphs: [
          { zh: '转写质量很重要，但校对路径同样重要。VoiceDesk 会把低置信度片段标出来，播放器、波形、时间戳和文本放在同一个工作区里。用户改完一个名字，全文查找替换可以把后面的同类错误一起处理，不必逐段重复。', en: 'Accuracy matters, but so does the correction path. VoiceDesk puts low-confidence spans, audio, waveform, timestamps, and text in one workspace. Once a name is corrected, find-and-replace can handle repeated errors across the transcript.' },
        ],
      },
      {
        title: { zh: '长任务必须能恢复', en: 'Long-running work must recover' },
        paragraphs: [
          { zh: '音视频导入和本地识别都可能持续很久。任务状态写入 SQLite，应用重启后能找到未完成任务；失败原因也保留在记录里，而不是让进度条突然消失。Rust 核心负责状态和文件边界，Python sidecar 只处理模型推理。', en: 'Media import and local recognition can run for a long time. Task state is persisted in SQLite so unfinished work can be recovered after restart, and failures remain visible instead of disappearing with a progress bar. Rust owns state and file boundaries; the Python sidecar stays focused on inference.' },
        ],
      },
      {
        title: { zh: 'AI 文档要能回到原文', en: 'Generated documents should remain traceable' },
        paragraphs: [
          { zh: '会议纪要、行动项和访谈洞察都只能使用输入的转写内容。提示词明确禁止补造人名、数字、日期、因果和行动项，输出再按 JSON Schema 校验。这样生成结果不是另一份不可检查的文本，而是一次有边界的整理。', en: 'Meeting notes, actions, and interview insights are restricted to the supplied transcript. The prompt forbids invented names, numbers, dates, causality, or actions, and the output is validated against a JSON schema. The result is bounded organization, not another uncheckable block of prose.' },
        ],
      },
    ],
    gallery: [],
    showcaseGroups: [
      {
        afterSection: 'summary',
        eyebrow: { zh: '真实界面', en: 'Product UI' },
        title: { zh: '桌面端的完整工作流', en: 'The complete desktop workflow' },
        description: { zh: '以下截图直接来自 VoiceDesk 项目。首页负责把入口收住，记录库和录音页处理输入，AI 文档页负责整理后的交付。', en: 'These screens come directly from VoiceDesk. Home keeps entry points focused, the library and recorder handle input, and AI Documents handles the final deliverable.' },
        layout: 'feature-grid',
        items: [
          { image: '/project-images/voicedesk/home.png', title: { zh: '首页', en: 'Home' }, description: { zh: '新建转写、最近项目和运行状态集中在一个起点。', en: 'New transcription, recent work, and runtime state share one starting point.' } },
          { image: '/project-images/voicedesk/library.png', title: { zh: '记录库', en: 'Library' }, description: { zh: '按状态管理录音、转写与文档，不把文件散落在多个入口。', en: 'Manage recordings, transcripts, and documents by state.' } },
          { image: '/project-images/voicedesk/ai-documents.png', title: { zh: 'AI 文档', en: 'AI Documents' }, description: { zh: '从已校对转写生成会议纪要、行动清单或访谈洞察。', en: 'Generate meeting notes, actions, or interview insights from reviewed transcripts.' } },
        ],
      },
      {
        afterSection: 1,
        title: { zh: '录音与紧凑布局', en: 'Recording and compact layout' },
        description: { zh: '桌面窗口不是永远全屏。录音与紧凑模式都按小窗口重新排过，不是简单缩放。', en: 'Desktop windows are not always full-screen. Recording and compact modes are recomposed for smaller widths instead of merely scaled down.' },
        layout: 'two-up',
        items: [
          { image: '/project-images/voicedesk/recorder.png', title: { zh: '录音', en: 'Recorder' }, description: { zh: '设备选择、波形、时长和录音状态保持在一处。', en: 'Device choice, waveform, duration, and recording state stay together.' } },
          { image: '/project-images/voicedesk/responsive-compact.png', title: { zh: '紧凑模式', en: 'Compact mode' }, description: { zh: '在窄窗口保留主要操作，次要信息重新分层。', en: 'Primary actions remain accessible while secondary information is reprioritized.' } },
        ],
      },
    ],
  },
  {
    slug: 'ainews-platform',
    featured: true,
    year: '2026',
    category: { zh: 'AI 资讯平台 / Research Tool', en: 'AI Intelligence Platform / Research Tool' },
    title: { zh: 'Ainews', en: 'Ainews' },
    subtitle: {
      zh: '从新闻聚合走到热点发现、选题研究和来源核验',
      en: 'From news aggregation to topic discovery, creator research, and source verification',
    },
    summary: {
      zh: 'Ainews 最早只是我自己用来追 AI 新闻的站点。后来我发现，“今天发生了什么”还不够，真正费时间的是判断哪些话题正在升温、谁已经在讨论、有没有一手来源，以及这件事值不值得继续做成内容。现在它更像一张持续更新的情报桌。',
      en: 'Ainews began as a personal AI news reader. It now focuses on the harder questions: which topics are rising, who is already discussing them, whether primary sources exist, and whether a signal is worth turning into content.',
    },
    role: {
      zh: '产品定义、信息架构、前后端实现、抓取链路与分析能力设计',
      en: 'Product framing, information architecture, full-stack implementation, ingestion pipeline design, and analytics surfaces',
    },
    capabilities: [
      { zh: '多源 Signal 与 Topic 聚类', en: 'Multi-source signals and topic clustering' },
      { zh: '24 / 48 / 72 小时趋势窗口', en: '24 / 48 / 72-hour trend windows' },
      { zh: '创作者观察与共题发现', en: 'Creator monitoring and shared-topic discovery' },
      { zh: '证据型选题与多渠道发布', en: 'Evidence-backed topics and multi-channel publishing' },
    ],
    challenge: {
      zh: '新闻源越来越多以后，首页反而更难用。快讯、官方发布、GitHub 项目和博主帖子混在一起，热度也容易被单个平台的数字带偏。我需要的不是更长的列表，而是能回到原文、能解释来源状态的主题。',
      en: 'As sources grew, the home feed became less useful. Briefs, official releases, GitHub projects, and creator posts needed to become traceable topics with honest source status rather than one longer list.',
    },
    approach: {
      zh: '后端把公开来源先收成 Signal，再按时间窗口聚成 Topic。博主内容只进入人工核验过的观察名单，回填状态会区分 complete、partial、blocked 和 unconfigured，不用 0 假装“没有数据”。前台围绕热点雷达、研究页、创作者和来源健康状态来组织。',
      en: 'Public sources become signals and then time-windowed topics. Creator history is limited to a verified watchlist, and backfill status distinguishes complete, partial, blocked, and unconfigured instead of treating unknown values as zero.',
    },
    outcome: {
      zh: '这次改造以后，Ainews 的重点从“新闻够不够多”移到“证据够不够好”。它能给出热点，也会把缺少密钥、来源失败或历史窗口不完整这些不体面的状态如实留在页面上。',
      en: 'The rebuild moved the product from “how much news do we have?” to “how good is the evidence?” Missing credentials, failed sources, and incomplete history remain visible instead of being smoothed over.',
    },
    result: {
      zh: '完成 Signal → Topic → 创作者核验 → 证据型选题链路，并开放 REST、OpenAPI、JSON Feed、RSS、SSE 与签名 Webhook。',
      en: 'Delivered the Signal-to-Topic-to-creator-verification pipeline with REST, OpenAPI, JSON Feed, RSS, authenticated SSE, and signed webhooks.',
    },
    nextStep: {
      zh: '下一步不是再加一排来源，而是用真实创作流程检查热点是否帮人省下研究时间，再决定要不要继续做 MCP 与 A2A。',
      en: 'Next is validating whether topic research actually saves creators time before adding planned surfaces such as MCP or A2A.',
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
            zh: 'Ainews 一开始就不是想做个"把 RSS 堆一块"的聚合页，而是给那些天天要盯 AI 动态的人，做个能长期用下去的工作台。既要收得全，也得让你更快瞄到哪些主题值得跟。',
            en: 'Ainews was framed less as another RSS reader and more as a working desk for people who need to stay close to AI developments at high frequency.',
          },
          {
            zh: '所以做的时候我一直在盯三件事，信息够不够密、翻起来顺不顺、能不能长期跑，而不是只弄个好看的前台。',
            en: 'That meant optimizing for information density, scanning speed, and operational durability instead of treating the interface as a purely visual exercise.',
          },
          {
            zh: '我自己更愿意把它当成个"研究入口"。首页接住每天的高频浏览，分析页帮你做判断，知识库管长期学习，搜索让旧内容还能再翻出来用。',
            en: 'The more useful framing is as a research entry product, where the feed handles daily scanning, analytics supports judgment, the glossary supports learning, and search keeps older material reusable.',
          },
        ],
      },
      {
        title: { zh: '系统设计', en: 'System Design' },
        paragraphs: [
          {
            zh: '后端是 Node.js + Express，围着 50 多个 RSS 源和可选的 API 源做抓取调度。每个源都带了优先级、超时、限流和启停状态，抓取时加了节流、失败重试、备用解析、文件缓存和自动恢复，免得一个点挂了整条链子跟着瘫。',
            en: 'The backend uses Node.js and Express to orchestrate 50+ RSS feeds plus optional API sources, with priorities, timeouts, throttling, retries, fallback parsing, file caching, and recovery logic built into the fetch layer.',
          },
          {
            zh: '数据层用 SQLite 落库，配上 WAL 模式和批量去重，本机部署够轻，新闻、源状态、用户偏好和登录会话都能稳稳存住。',
            en: 'SQLite in WAL mode provides durable storage for articles, source health, user preferences, and auth sessions, while keeping deployment lightweight enough for a self-hosted tool.',
          },
          {
            zh: '我在这儿花心思的不是堆技术名词，是让这套链路别断。高频抓取的玩意，恢复能力、缓存和源状态能不能看见，比单次请求快那零点几秒重要得多。',
            en: 'The engineering emphasis is durability rather than stack novelty. For a high-frequency ingestion product, recovery behavior, caching, and source visibility matter more than raw request speed.',
          },
        ],
      },
      {
        title: { zh: '产品亮点', en: 'Product Highlights' },
        paragraphs: [
          {
            zh: '前端不是个单列表页，而是围着"持续跟踪"铺了好几层入口，实时资讯流、系统状态面板、热门话题和趋势分析、高级搜索、收藏、账户，还有 AI 术语知识库和架构导读。',
            en: 'On the frontend, the product expands beyond a simple feed into a layered workspace with live news, system health, analytics, advanced search, favorites, accounts, and a glossary plus architecture guide.',
          },
          {
            zh: '我自己比较得意的一点是，把"信息茧房"这个老挂在嘴边的词，做成了能算的多样性评分和推荐逻辑。再叠一层靠关键词提取的趋势分析，让这个资讯站不只摆内容，还能帮你做判断。',
            en: 'One of the stronger product moves was turning “filter bubble” risk into a concrete diversity score and recommendation layer, alongside keyword-based trend analysis that helps the platform assist judgment instead of merely displaying content.',
          },
          {
            zh: '这些模块不是各干各的功能，都围着同一件事转，帮你更快地发现主题、搞懂背景、形成判断、回头查资料。',
            en: 'These modules are not isolated features. They all support the same user task: discover a theme, understand its context, form a view, and come back to the source material later.',
          },
        ],
      },
      {
        title: { zh: '核心创新', en: 'Key Innovations' },
        paragraphs: [
          {
            zh: '这项目真正跟别的不一样的地方，不在"信源多"，而是把资讯站从被动刷的页面，做成了带判断辅助的工作台。趋势、多样性评分、知识库这三层叠一块，改变了看信息的方式。',
            en: 'What makes the project distinctive is not just the number of feeds, but the shift from passive reading into a workspace with analytical support layers.',
          },
          {
            zh: '看新闻、找资料、学概念、做判断，这四样它都能兜住，所以不单是个资讯入口，也能当学习和研究工具。',
            en: 'It supports reading, searching, learning, and evaluating in one system, which makes it useful as both an intelligence surface and a research-oriented learning product.',
          },
          {
            zh: '这也是我愿意把它放主页展示的原因。比起一个单点功能 demo，它更能把我在产品定义、信息架构和系统实现上的综合能力摊开给人看。',
            en: 'That is also why the project works well in a portfolio: it shows product framing, information architecture, systems thinking, and presentation quality in one case.',
          },
        ],
      },
      {
        title: { zh: '工程取舍', en: 'Engineering Decisions' },
        paragraphs: [
          {
            zh: '这项目里不少功夫花在"能不能一直跑"上。数据库空了自动切演示数据、WebSocket 推刷新、客户端本地缓存加防抖、服务状态面板，Docker 和 Nginx 反代也预留好了。这些不显眼，但决定了它是个能长期跑的产品，不是一次性 demo。',
            en: 'A large part of the work went into durability details such as demo fallbacks, WebSocket-driven refresh, client-side caching and debouncing, a live status panel, and Docker plus reverse-proxy deployment paths.',
          },
          {
            zh: '说白了这项目不是做来截图的。在好看的界面底下，运行和部署的思路都留好了，这点在案例页里我特意讲清楚。',
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
        image: '/project-images/ainews/6.png',
      },
      {
        label: { zh: '架构导读', en: 'Architecture Guide' },
        description: {
          zh: '把模型架构、算法框架和训练方法做成可阅读、可对照的导读页，让资讯平台同时具备知识组织能力。',
          en: 'A long-form architecture guide gives the platform a deeper learning layer beyond daily news tracking.',
        },
        image: '/project-images/ainews/4.png',
      },
      {
        label: { zh: '知识层', en: 'Knowledge Layer' },
        description: {
          zh: '通过术语知识库和模型架构导读，把资讯消费延伸到系统化理解，适合持续学习与对外展示。',
          en: 'A glossary and architecture guide extend the product from news consumption into structured understanding and long-term learning.',
        },
        image: '/project-images/ainews/3.png',
      },
      {
        label: { zh: '搜索入口', en: 'Search Surface' },
        description: {
          zh: '搜索与筛选页把新闻、术语和主题检索组织成更清晰的入口，适合高频查找与横向比对。',
          en: 'Search and filter surfaces make it easier to look up topics, compare coverage, and return to specific themes quickly.',
        },
        image: '/project-images/ainews/5.png',
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
          zh: '这组页面是平台的第二层能力，不单把新闻聚起来，还把概念、结构和长内容解释组织成能学的产品层。用户不用离开平台去外面找解释和背景。',
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
      zh: '顺着「大模型从入门到专家」这条线，把上课、练面试、动手敲代码、AI 导师、读论文和管理员发课全收进一个产品里。学习在这儿不是光看课，能上手、能练、也能回看进度。',
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
            zh: 'LearningByDoing 的核心不是再做个把课程视频和讲义排进去的站点，而是个"能真动手学"的工作台。学习者不该只盯着看，得在同一界面里理解概念、改代码、看结果、问问题、再回知识点。',
            en: 'The project was framed not as another lesson site, but as a learning workspace where understanding, coding, questioning, and reviewing happen in one place.',
          },
          {
            zh: '所以它更像交互式学习产品，不是单纯内容站。我想解决的真问题是，把那些本来散掉的学习动作，压成一条连得起来的路径。',
            en: 'That makes it closer to an interactive product than a pure content site, with the goal of compressing fragmented learning actions into one continuous path.',
          },
          {
            zh: '放主页展示，这项目最值得说的也正是这个。它撑起来的不是某个单点功能，而是整套学习体验和背后的系统组织。',
            en: 'For portfolio presentation, the strongest point is not any single feature, but the coherence of the full learning experience and system structure.',
          },
        ],
      },
      {
        title: { zh: '产品结构', en: 'Product Structure' },
        paragraphs: [
          {
            zh: '平台围着五条课程主线铺开，大模型、机器学习、Python、计网、计组，首发是"大模型从入门到专家"。每条线拆成章节，每章同时给知识讲解、面试模式、动手实战、可视化步骤和练习入口。',
            en: 'The platform is organized around five curriculum tracks, with the flagship LLM course supported by chapter-level teaching, interview mode, hands-on practice, and visual explanations.',
          },
          {
            zh: '论文学习单独抽成入口，不塞进课程章节里。好处是课程内容和外部论文能接上，学课和读原始资料之间就通了。',
            en: 'Paper study is separated into its own surface, allowing the platform to connect course learning with external source material instead of mixing everything into chapter pages.',
          },
          {
            zh: '设置中心和学习记录也不是附属页，是这套产品的稳定层。默认模式、面板布局、阅读密度、学习回放，都能存住、能回到上次的状态。',
            en: 'Settings and learning history act as a stability layer, making mode preference, panel layout, reading density, and replay behavior persistent over time.',
          },
        ],
      },
      {
        title: { zh: '核心体验', en: 'Core Experience' },
        paragraphs: [
          {
            zh: '这项目我最喜欢的一点，是没把"教学""练习""答疑"拆成三套系统，全压进同一个工作台。知识模式讲清概念，面试模式练表达，动手实战把知识落到代码和终端结果上。',
            en: 'One of the strongest product decisions is treating teaching, practice, and explanation as one workspace rather than three disconnected systems.',
          },
          {
            zh: '动手实战里能直接写 Python、跑代码、看终端输出，还能同步看到跟代码高亮联动的结构化可视化。需要时让 AI 导师顺着当前上下文解释代码或知识点。这一套比光放个代码编辑器，更像一个真实的学习过程。',
            en: 'Hands-on mode combines Python editing, execution, terminal feedback, synchronized visualization, and contextual AI tutoring, making the experience closer to real study than a simple code editor.',
          },
          {
            zh: '面试模式也不是换个皮，是明确把界面收窄，重点只留答题、提示和调试结果。这种切换说明产品不是堆页面，是给不同学习任务设计不同状态。',
            en: 'Interview mode is not just a visual variant; it narrows the interface to answer drafting, hints, and debug output, which reflects task-specific workspace design.',
          },
        ],
      },
      {
        title: { zh: '核心创新', en: 'Key Innovations' },
        paragraphs: [
          {
            zh: '这类项目真正难的，不是把课程内容列出来，是把"抽象概念"变成"能上手的学习动作"。LearningByDoing 用知识页、可视化步骤、代码模板、终端反馈和 AI 导师，把这一层做得比普通课程产品更扎实。',
            en: 'The distinctive move is turning abstract concepts into operational learning actions through teaching pages, visual steps, code templates, terminal feedback, and AI tutoring.',
          },
          {
            zh: '另一个有辨识度的点，是把论文导入做成了学习流的一部分。导入 PDF、Markdown 或 TXT 后，系统抽摘要、方法步骤、关键公式和课程映射，平台就不只"教现有课程"，也开始能接外部知识材料。',
            en: 'Another strong differentiator is treating paper import as part of the learning flow, so external source material can be transformed into structured study surfaces inside the product.',
          },
          {
            zh: '再往外一层，管理员草稿生成和发布流，说明系统开始顾内容生产端，不只是对着学生。这让产品更像能持续扩展的学习平台，不是一次性作品。',
            en: 'The admin draft-generation and publishing flow also shows the system has started to account for content operations, not only learner-facing consumption.',
          },
        ],
      },
      {
        title: { zh: '工程实现', en: 'Engineering Implementation' },
        paragraphs: [
          {
            zh: '技术上这项目是单仓前后端。前端用 React 19、Vite、Tailwind、Monaco 和 Motion 搭多面板界面；后端 Express + TypeScript 管课程、用户状态、管理员草稿和 AI 调用；跑代码靠服务端 Python 沙盒。',
            en: 'Technically, the project uses a monorepo setup with React 19, Vite, Tailwind, Monaco, and Motion on the frontend, plus Express + TypeScript and a server-side Python sandbox on the backend.',
          },
          {
            zh: '真正重要的不是这些技术名词，是它们被组织成了能撑长期学习产品的结构。用户状态能存、布局能记、课程和论文能扩、AI provider 能换、管理员内容能发。这些细节决定它更像产品，不是一张概念图。',
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
    slug: 'codex-switch',
    year: '2025',
    category: { zh: '桌面工具 / AI 账号管理', en: 'Desktop Tool / AI Account Manager' },
    title: { zh: 'Codex Switch', en: 'Codex Switch' },
    subtitle: {
      zh: '在 macOS 上管理多个 Codex / GPT 账号，一键切换，查看额度',
      en: 'Manage multiple Codex and GPT accounts on macOS — switch in one click, monitor quota',
    },
    summary: {
      zh: '一个轻量的 macOS 小工具，给天天用 Codex CLI 的人。存多个账号、看每个号 5 小时 / 1 周的额度还剩多少、什么时候重置，一键把选中的号写回 ~/.codex/auth.json，CLI 直接就能用。React + Vite + Tauri 做的，纯本地，数据都在自己机器上。',
      en: 'A lightweight macOS desktop app for developers who run multiple Codex accounts. Save accounts, check quota remaining on 5h and 1-week windows, see reset times, and write the selected account back to ~/.codex/auth.json with one click. Built with React, Vite, and Tauri — local-only, data stays on device.',
    },
    role: {
      zh: '产品设计、前端开发、Tauri 集成、账号状态管理与本地数据方案',
      en: 'Product design, frontend development, Tauri integration, account state management, local data storage',
    },
    capabilities: [
      { zh: '多账号保存与一键切换', en: 'Multi-account storage and one-click switching' },
      { zh: '额度可见性：5h / 1周 / 重置时间', en: 'Quota visibility: 5h, 1-week, and reset time' },
      { zh: 'OAuth 登录与 auth.json 导入', en: 'OAuth login and auth.json import' },
      { zh: '本地数据，不依赖云服务', en: 'Local-only data, no cloud dependency' },
    ],
    challenge: {
      zh: '用多个 Codex 账号轮换用的开发者，每次切换都要手动改 auth.json，还要自己记住哪个账号还有额度。没有合适的工具，全靠脑子记。',
      en: 'Developers rotating through multiple Codex accounts had to manually edit auth.json each time and mentally track which account had quota left. No good tool existed.',
    },
    approach: {
      zh: '用 Tauri 把 React 前端打成原生 macOS app，账号池保存在本机应用数据目录。OAuth 登录通过系统浏览器完成，登录态直接写入本地文件。额度数据通过 API 定时刷新，失败时保留上次成功的结果并标注。切换账号只是把选中账号的 auth.json 写到 ~/.codex/ 下。',
      en: 'Tauri wraps the React frontend into a native macOS app. Account pool is saved in the local app data directory. OAuth login goes through the system browser and writes state to local files. Quota data refreshes via API; on failure, it shows the last successful result with a note. Switching accounts writes the chosen account\'s auth.json to ~/.codex/.',
    },
    outcome: {
      zh: '不用再手动改文件、不用记哪个账号有额度，打开 app 扫一眼就知道用哪个。也不需要联网或者服务端，只要本机跑 macOS。',
      en: "No more manual file edits, no more mental quota tracking. Open the app, scan the list, pick the right account. No server needed — just macOS.",
    },
    result: {
      zh: '账号切换时间从"手动改文件 + 回忆额度"压缩到一次点击。',
      en: 'Account switching reduced from manual file editing and mental recall to a single click.',
    },
    nextStep: {
      zh: '后续可以加托盘菜单快速切换、以及在 Codex 额度刷新时自动通知。',
      en: 'Next: tray menu for quick switching without opening the app, and notifications when quota resets.',
    },
    accent: 'from-[rgba(80,80,100,0.22)] via-[rgba(50,50,80,0.08)] to-transparent',
    externalLinks: [
      {
        label: { zh: '查看源码', en: 'View on GitHub' },
        url: 'https://github.com/MarcusDog/codex-switch',
      },
    ],
    detailSections: [
      {
        title: { zh: '为什么做这个', en: 'Why this exists' },
        paragraphs: [
          {
            zh: '我自己就是目标用户。用 Codex CLI 写代码时，一个账号的额度用完了就得换另一个，每次都要 vi ~/.codex/auth.json 手动粘贴内容，还要自己回忆哪个账号是今天早上刚重置的、哪个还有几小时。烦了就自己做了一个。',
            en: "I'm the target user. Writing code with Codex CLI, I'd burn through one account's quota and have to switch — which meant opening a terminal, hand-editing auth.json, and trying to remember which account reset this morning. Got tired of it and built this.",
          },
        ],
      },
      {
        title: { zh: '技术选型', en: 'Technical Choices' },
        paragraphs: [
          {
            zh: 'Tauri 让 React 应用打成本地 macOS 桌面应用，体积小、启动快、不需要 Electron 的重量。账号数据只存在本机，没有服务端，不需要联网登录（除了刷新额度和 OAuth）。',
            en: "Tauri wraps React into a native macOS app — smaller binary, fast startup, none of Electron's weight. Account data is local-only. No server, no cloud login except for quota refresh and OAuth.",
          },
        ],
      },
    ],
    gallery: [],
    showcaseGroups: [],
  },
  {
    slug: 'flow-socket',
    year: '2025',
    category: { zh: '实时通信 / 局域网工具', en: 'Real-time Transfer / LAN Tool' },
    title: { zh: 'Flow Socket', en: 'Flow Socket' },
    subtitle: {
      zh: '局域网里多设备之间传文字、文件、链接，不用微信，不用 QQ，不用邮件',
      en: 'Transfer text, files, and links between devices on the same network — no WeChat, no email, no middleman',
    },
    summary: {
      zh: '手机、平板、笔记本之间临时传个东西，多数人的解法是微信发给自己，可这得所有设备都登同一个号，内容还留在人家服务器上。Flow Socket 让一台电脑当主机，其他设备开浏览器就能用，局域网直连、实时同步。文字走 WebSocket，大文件走 WebRTC 点对点直传。',
      en: 'Sharing things between phone, tablet, laptop, desktop — the usual answer is WeChat to yourself. But that needs the same account on all devices and leaves data on their servers. Flow Socket puts one machine as host, others join via browser, LAN-direct, real-time. Text and links use WebSocket; large files use WebRTC DataChannel.',
    },
    role: {
      zh: '系统设计、全栈实现、实时通信层设计、WebRTC 集成与房间管理逻辑',
      en: 'System design, full-stack implementation, real-time communication layer, WebRTC integration, and room management',
    },
    capabilities: [
      { zh: '局域网设备直连，无需中转服务器', en: 'Direct LAN connection, no external server relay' },
      { zh: 'WebSocket 实时文字与链接同步', en: 'WebSocket real-time text and link sync' },
      { zh: 'WebRTC DataChannel 大文件直传', en: 'WebRTC DataChannel for large file transfer' },
      { zh: '二维码入房，手机扫一下就进', en: 'QR code room join — phone scan, done' },
    ],
    challenge: {
      zh: '在不同操作系统的设备之间快速传东西，现有方案要么需要装 App、要么需要同账号登录、要么走云端绕一圈。想要的是：打开浏览器就能用，局域网直接传，不留数据。',
      en: "Sharing between mixed OS devices quickly — existing solutions need an app install, shared account login, or cloud relay. The goal: open a browser and go, direct LAN transfer, nothing stored.",
    },
    approach: {
      zh: '后端用 Node.js 做 WebSocket 服务器，管理房间、设备、邀请码和消息路由。前端做成 PWA，支持在手机桌面添加图标。文件传输通过协商 WebRTC DataChannel 点对点直传，减少服务器带宽依赖。房间用邀请码或二维码加入，不需要注册账号（也支持注册）。',
      en: 'Node.js WebSocket server manages rooms, devices, invite codes, and message routing. Frontend is a PWA that can be installed on mobile home screens. File transfer negotiates WebRTC DataChannel for peer-to-peer delivery, reducing server bandwidth. Rooms join via invite code or QR code — no account required (account mode also supported).',
    },
    outcome: {
      zh: '在局域网里传文字和小文件是即时的，大文件走 WebRTC 也不经服务器。手机扫二维码加房间，比发微信给自己快。数据留在局域网里，不上任何云。',
      en: "Text and small files transfer instantly on LAN. Large files go peer-to-peer via WebRTC without touching the server. Phone scans QR to join — faster than sending to yourself on WeChat. Data stays on your local network.",
    },
    result: {
      zh: '局域网设备之间传文件和消息，不再需要借道微信或邮件。',
      en: 'Files and messages move between LAN devices without routing through WeChat or email.',
    },
    nextStep: {
      zh: '后续计划支持离线挂起（断线重连后继续传）和端对端加密，让它在稍微不可信的网络里也能用。',
      en: 'Next: offline-suspend (resume transfers after reconnect) and end-to-end encryption for use on less-trusted networks.',
    },
    accent: 'from-[rgba(56,140,220,0.22)] via-[rgba(40,100,180,0.08)] to-transparent',
    externalLinks: [
      {
        label: { zh: '查看源码', en: 'View on GitHub' },
        url: 'https://github.com/MarcusDog/flow-socket',
      },
    ],
    detailSections: [
      {
        title: { zh: '为什么不用现成工具', en: 'Why not use existing tools' },
        paragraphs: [
          {
            zh: '我试过很多方案。AirDrop 只在苹果设备之间用；微信发给自己要求同账号、内容上服务器；局域网共享文件夹配起来麻烦、安全性差。想要的只是：两台设备在同一 WiFi，打开浏览器，直接传，传完拉倒。',
            en: "I tried the options. AirDrop only works between Apple devices. WeChat self-send requires the same account everywhere and puts data on their servers. Local network folder sharing is annoying to set up and insecure. I just wanted: two devices on the same WiFi, open browser, transfer, done.",
          },
        ],
      },
      {
        title: { zh: 'WebSocket + WebRTC 的分工', en: 'How WebSocket and WebRTC split the work' },
        paragraphs: [
          {
            zh: '文字和链接用 WebSocket，因为服务器本来就在处理连接，顺手推送就行，延迟极低。文件如果也走 WebSocket 就要经过服务器中转，带宽和速度都差。所以大文件用 WebRTC DataChannel，两端浏览器之间点对点直连，服务器只做信令协商，不碰实际数据。',
            en: "Text and links use WebSocket — the server is already managing connections, so it can relay these instantly with very low latency. Files via WebSocket would route through the server, which wastes bandwidth and slows things down. So large files use WebRTC DataChannel — peer-to-peer between browsers, server only does signaling, never touches the actual bytes.",
          },
        ],
      },
    ],
    gallery: [],
    showcaseGroups: [],
  },
  {
    slug: 'openclaw-auto-deploy',
    year: '2025',
    category: { zh: '自动化部署 / 开发者工具', en: 'Auto Deploy / Developer Tool' },
    title: { zh: 'OpenClaw Auto Deploy', en: 'OpenClaw Auto Deploy' },
    subtitle: {
      zh: 'Windows、WSL2、Linux、macOS 都能一键装好 OpenClaw，出问题自动修',
      en: 'One-click OpenClaw install on Windows, WSL2, Linux, and macOS — with auto-repair when things go wrong',
    },
    summary: {
      zh: '在不同平台装 OpenClaw 挺折腾，尤其 Windows 上的 WSL2。这个工具把安装、诊断、配模型、接渠道、管服务全塞进一套交互脚本里，Node.js 22+ 就能跑，出错了自己试着修。',
      en: "Installing OpenClaw across platforms is annoying, especially on Windows with WSL2. This tool compresses installation, diagnostics, model config, channel setup, and service management into one guided script flow. Runs on Node.js 22+, interactive throughout, auto-repairs on failure.",
    },
    role: {
      zh: '工具设计、跨平台脚本开发、诊断与自动修复逻辑、交互式安装引导',
      en: 'Tool design, cross-platform scripting, diagnostics and auto-repair logic, interactive install guidance',
    },
    capabilities: [
      { zh: 'Windows / WSL2 / Linux / macOS 全覆盖', en: 'Windows, WSL2, Linux, and macOS support' },
      { zh: '交互式安装引导，不需要读文档', en: 'Interactive guided install — no documentation needed' },
      { zh: '出错自动诊断与修复', en: 'Automatic diagnostics and repair on failure' },
      { zh: '模型配置与渠道接入一并处理', en: 'Model config and channel setup in the same flow' },
    ],
    challenge: {
      zh: 'OpenClaw 在不同平台的安装路径不一样，Windows 上还需要先配 WSL2，中间容易卡在权限、路径、依赖这些地方。对不熟悉命令行的用户来说，官方文档够用但不够友好。',
      en: "OpenClaw's installation path varies by platform, and Windows needs WSL2 first — where it's easy to get stuck on permissions, paths, and dependencies. The official docs work, but they're not friendly for users who aren't comfortable in a terminal.",
    },
    approach: {
      zh: '用 Node.js 写交互式安装脚本，按平台检测当前环境、判断缺什么、按顺序引导安装。每一步都有验证，失败时打印具体原因并尝试自动修复。模型配置和渠道接入也做成交互选项，不需要手动改配置文件。',
      en: 'Node.js interactive installer detects the current platform, identifies what\'s missing, and guides installation in sequence. Each step has verification; on failure, it prints the specific reason and tries auto-repair. Model config and channel setup are interactive options — no manual config file editing.',
    },
    outcome: {
      zh: '在测试的几个平台上，从下载到能用平均比照着文档自己装省一半时间。出错时不是直接报错退出，而是告诉你出在哪、自动尝试修，修不了再告诉你具体怎么手动解决。',
      en: 'Across tested platforms, install time is about half that of following the docs manually. On error, it explains where things broke, tries auto-repair, and only falls back to manual instructions if repair fails.',
    },
    result: {
      zh: '跨平台 OpenClaw 安装从"看文档一步步来"变成"跑脚本按提示走"。',
      en: 'Cross-platform OpenClaw install changed from "read docs and figure it out" to "run script and follow prompts."',
    },
    nextStep: {
      zh: '后续计划加入更新检测（自动判断当前版本是否需要升级）和更完整的 Windows 原生支持（不依赖 WSL2）。',
      en: 'Next: version update detection and fuller native Windows support without requiring WSL2.',
    },
    accent: 'from-[rgba(245,158,11,0.22)] via-[rgba(200,120,20,0.08)] to-transparent',
    externalLinks: [
      {
        label: { zh: '查看源码', en: 'View on GitHub' },
        url: 'https://github.com/MarcusDog/openclaw-auto-deploy',
      },
    ],
    detailSections: [
      {
        title: { zh: '为什么做', en: 'Why this exists' },
        paragraphs: [
          {
            zh: 'OpenClaw 的安装在 macOS 上还算顺，但 Windows 上要先搞 WSL2、装对版本的 Node、配路径，每一步都可能在奇怪的地方卡住。身边有人跟着文档装了两个小时没成功，问我，我帮他跑了二十分钟，主要时间花在诊断上。之后就决定把这个诊断+修复的逻辑自动化。',
            en: "OpenClaw installs cleanly on macOS, but Windows needs WSL2 first, the right Node version, path config — any step can silently break. Someone asked me for help after two hours of trying from the docs. I fixed it in twenty minutes, mostly diagnosing. I automated that diagnosis-and-repair loop afterward.",
          },
        ],
      },
    ],
    gallery: [],
    showcaseGroups: [],
  },
  compactProject({
    slug: 'ayanews-skill',
    year: '2026',
    category: { zh: 'Agent Skill / 研究工具', en: 'Agent Skill / Research Tool' },
    title: { zh: 'AyaNewsSkill', en: 'AyaNewsSkill' },
    subtitle: { zh: '让 Agent 带着来源读新闻，也知道证据不够时应该停下来', en: 'A source-backed news skill that tells agents when the evidence is not enough' },
    summary: { zh: '这是 Ainews 的 Agent 入口。它不直接替用户下结论，而是先取回新闻、热点和博主公开内容，整理成带来源编号的证据包，再交给 Codex、Claude Code 或其他支持 Agent Skills 的工具继续写作。', en: 'The agent-facing layer of Ainews retrieves news, topics, and public creator posts, packages them with numbered sources, and hands the evidence to Codex, Claude Code, or another Agent Skills client.' },
    role: { zh: 'Skill 协议设计、命令行工具、证据约束、跨环境安装与兼容层', en: 'Skill protocol, CLI, evidence constraints, cross-environment installation, and compatibility layer' },
    capabilities: [{ zh: '零密钥默认接入', en: 'Keyless default access' }, { zh: '证据包与原文引用', en: 'Evidence packs and source links' }, { zh: '信息茧房复核', en: 'Filter-bubble review' }],
    challenge: { zh: '让 Agent 读到新闻很容易，让它分清官方发布、媒体转述和社区讨论的证据边界更难。资料不够时，它还得愿意返回“证据不足”。', en: 'Reading news is easy for an agent. Keeping official releases, media reports, and community discussion in their proper evidence boundaries is harder, especially when the correct answer is insufficient evidence.' },
    approach: { zh: '所有研究结果都要求保留 [S#]、发布者、日期和原文 URL。Skill 会主动拉开来源类型与地区，不够支撑结论时返回 insufficient_evidence，而不是补齐一篇看上去完整的文章。', en: 'Every research result keeps an [S#] marker, publisher, date, and original URL. The skill diversifies source types and regions, and returns insufficient_evidence instead of filling gaps with plausible prose.' },
    outcome: { zh: '同一套命令可以查询最新资讯、热点机会、创作者内容和每日信息茧房复核，并能安装到 Codex、Claude Code 或通用 skills 目录。', en: 'One command surface now covers latest news, topic opportunities, creator signals, and daily diversity review, with installers for Codex, Claude Code, and generic skills directories.' },
    result: { zh: '公开发布为零第三方运行依赖的 Node.js Skill，并与 Ainews 新旧接口保持兼容。', en: 'Published as a zero-runtime-dependency Node.js skill with compatibility across current and legacy Ainews APIs.' },
    nextStep: { zh: '继续收紧事实引用，并把内容生产前的证据检查做成更清楚的失败反馈。', en: 'Continue tightening citations and make pre-writing evidence failures easier to understand.' },
    accent: 'from-[rgba(76,116,104,0.20)] via-[rgba(190,157,94,0.08)] to-transparent',
    externalLinks: [{ label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/AyaNewsSkill' }],
    detailSections: [{ title: { zh: '把“会搜索”改成“会交代来源”', en: 'From search access to source accountability' }, paragraphs: [{ zh: '我不希望 Agent 把几个标题拼成一篇文章。AyaNewsSkill 先构造可检查的证据包，写作只是后一步。官方、研究、媒体和工程社区会被分别标记；来源太少时，结果会明确停在证据不足。', en: 'I did not want an agent to stitch headlines into an article. AyaNewsSkill builds an inspectable evidence pack first. Official, research, media, and engineering sources are labeled separately, and the run stops when the evidence is too thin.' }] }],
  }),
  compactProject({
    slug: 'promptball',
    year: '2026',
    category: { zh: '桌面应用 / Prompt 工具', en: 'Desktop App / Prompt Tool' },
    title: { zh: 'PromptBall', en: 'PromptBall' },
    subtitle: { zh: '常驻桌面的 Prompt 工作台，把优化、版本和评估放在一起', en: 'A desktop prompt workspace for writing, versioning, optimization, and evaluation' },
    summary: { zh: 'PromptBall 用一个可召回的桌面悬浮入口，把零散在聊天窗口和文本文件里的 Prompt 收回来。可以写结构化 Prompt、管理模板、看版本差异，也能用同一输入做 A/B 测试。', en: 'PromptBall uses a recallable desktop entry point to bring prompts out of scattered chats and text files. It supports structured writing, templates, version diffs, and A/B tests against the same input.' },
    role: { zh: '产品设计、Tauri 桌面端、React 界面、Rust 数据与本地安全设计', en: 'Product design, Tauri desktop app, React interface, Rust data layer, and local security' },
    capabilities: [{ zh: '悬浮入口与全局快捷键', en: 'Floating entry and global shortcuts' }, { zh: '模板、版本与 Diff', en: 'Templates, versions, and diffs' }, { zh: '盲评 A/B 测试', en: 'Blind A/B testing' }],
    challenge: { zh: 'Prompt 很容易复制，却很难记住哪个版本真正好用。只做一个收藏夹解决不了评估、回滚和不同模型之间的差异。', en: 'Prompts are easy to copy and hard to evaluate. A bookmark list does not solve regression, rollback, or differences between models.' },
    approach: { zh: '应用把写作、优化、评估和历史放进一条桌面流程。每次修改会留下版本，A/B 测试打乱左右顺序，尽量减少“我知道哪个是新版本”带来的偏见。', en: 'Writing, optimization, evaluation, and history share one desktop flow. Each edit creates a version, and A/B results are randomized to reduce label bias.' },
    outcome: { zh: '现在它能作为本地 Prompt 库使用，也能接 OpenAI-compatible 或 Ollama 模型做优化与评估。', en: 'It now works as a local prompt library and can connect to OpenAI-compatible or Ollama models for optimization and evaluation.' },
    result: { zh: '完成 Windows 桌面工作台、22 个内置模板、版本管理和盲评测试主流程。', en: 'Delivered the Windows workspace, 22 built-in templates, version management, and the core blind-test flow.' },
    nextStep: { zh: '用真实长期使用数据校准评分，不让“100 分 Prompt”变成另一种装饰。', en: 'Calibrate scoring with long-term use so a “100-point prompt” does not become decoration.' },
    accent: 'from-[rgba(102,82,136,0.20)] via-[rgba(190,157,94,0.08)] to-transparent',
    externalLinks: [{ label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/promptball' }],
    detailSections: [{ title: { zh: 'Prompt 需要版本，而不是一堆副本', en: 'Prompts need versions, not duplicate files' }, paragraphs: [{ zh: '每次改 Prompt 都另存一份，过一周就很难知道差异。PromptBall 把修改、评分和实际使用结果挂在同一条版本线上，回滚和对比都不再依赖文件名。', en: 'Saving every revision as another file makes differences impossible to follow. PromptBall keeps edits, scores, and observed outcomes on one version line, so compare and rollback no longer depend on filenames.' }] }],
  }),
  compactProject({
    slug: 'qzone-history',
    year: '2026',
    category: { zh: '个人数据 / Go 工具', en: 'Personal Data / Go Tool' },
    title: { zh: 'Qzone History', en: 'Qzone History' },
    subtitle: { zh: '把自己还能访问的 QQ 空间历史备份到本地', en: 'A local backup and reconstruction tool for Qzone history you can still access' },
    summary: { zh: '这是一个很克制的个人数据工具：二维码登录，分页读取当前账号可访问的活动记录，落到 SQLite，再重建说说和留言并导出 JSON。它不把普通抓取包装成 AI，也不碰没有权限的数据。', en: 'A deliberately narrow personal-data tool: QR login, paginated retrieval of accessible activity, local SQLite storage, reconstruction of posts and guestbook messages, and JSON export.' },
    role: { zh: 'Go 应用架构、QQ 空间客户端、数据重建、SQLite 与本地安全边界', en: 'Go application architecture, Qzone client, data reconstruction, SQLite, and local security boundaries' },
    capabilities: [{ zh: '二维码本地登录', en: 'Local QR login' }, { zh: '历史重建与 JSON 导出', en: 'History reconstruction and JSON export' }, { zh: '本地 SQLite 保存', en: 'Local SQLite storage' }],
    challenge: { zh: '历史活动流并不等于可以直接阅读的说说和留言；接口也可能变化。备份工具还必须明确保护 Cookie 和导出文件。', en: 'An activity stream is not a readable archive of posts and messages, and the upstream interface can change. A backup tool also needs clear handling for cookies and exported private data.' },
    approach: { zh: '应用层把抓取、重建和导出拆开，失败响应不会进入数据库。二维码页只监听 127.0.0.1，导出文件在系统支持时限制为当前用户读写。', en: 'Retrieval, reconstruction, and export are separated, and failed responses never enter storage. The QR page binds only to 127.0.0.1, and exported files are restricted to the current user where supported.' },
    outcome: { zh: '当前稳定输出 SQLite 与 JSON；Excel 和 HTML 被明确标记为尚未实现。', en: 'The stable outputs are SQLite and JSON; Excel and HTML remain explicitly unimplemented.' },
    result: { zh: '完成可运行的 Go 命令行流程、配置覆盖和安全说明，并补齐测试与 vet / race 检查入口。', en: 'Delivered the runnable Go flow, configuration overrides, security notes, and test, vet, and race-check commands.' },
    nextStep: { zh: '跟随接口变化维护解析，并在不牺牲本地隐私的前提下增加可阅读导出。', en: 'Maintain parsing as interfaces change and add readable exports without weakening local privacy.' },
    accent: 'from-[rgba(89,116,144,0.18)] via-[rgba(190,157,94,0.07)] to-transparent',
    externalLinks: [{ label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/qzone-history' }],
    detailSections: [{ title: { zh: '先把自己的数据拿回来', en: 'Bring personal history back first' }, paragraphs: [{ zh: '这个项目没有先做漂亮的时间线，而是先保证数据能稳定落地。活动记录、说说和留言之间的关系在 usecase 层重建；原始登录信息和导出结果都只留在本机。', en: 'The project started with reliable local capture rather than a polished timeline. Relationships between activity, posts, and messages are rebuilt in the use-case layer, while login state and exports remain on the machine.' }] }],
  }),
  compactProject({
    slug: 'code-loop',
    year: '2026',
    category: { zh: 'AI 工程 / 自动化', en: 'AI Engineering / Automation' },
    title: { zh: 'code-loop', en: 'code-loop' },
    subtitle: { zh: '让代码 Agent 持续工作，但每一轮都有范围、记录和复查', en: 'Continuous coding-agent runs with scope, state, and review around every iteration' },
    summary: { zh: 'code-loop 把 Claude Code、opencode 等 CLI 放进一个可恢复的迭代循环。需求先过 SPEC 和架构分析，每轮只接一个原子目标；连续失败会切换策略或引擎，Web 面板还能在运行中补充反馈。', en: 'code-loop wraps Claude Code, opencode, and other CLIs in a recoverable iteration loop. Requirements pass through spec and architecture gates, each round gets one atomic target, and repeated failures trigger a strategy or engine change.' },
    role: { zh: 'Shell 编排、状态持久化、多引擎适配、审核周期与 Web 仪表盘', en: 'Shell orchestration, persisted state, multi-engine adapters, review cadence, and web dashboard' },
    capabilities: [{ zh: '多引擎切换', en: 'Multi-engine switching' }, { zh: '断点恢复', en: 'Resume from state' }, { zh: '死循环检测与复查', en: 'Loop detection and review' }],
    challenge: { zh: '“让 Agent 一直跑”很容易变成一直重复同一种错误。长任务还会遇到超时、上下文膨胀和中途反馈无法进入下一轮的问题。', en: '“Keep the agent running” can easily become repeating the same mistake. Long jobs also hit timeouts, context growth, and difficulty injecting feedback into the next iteration.' },
    approach: { zh: '每轮限制为原子目标和少量文件，固定输出变更、验证与下一轮衔接。相似度过高会触发策略调整，每三轮换审核模型复查，所有状态可以从最近一次运行恢复。', en: 'Each round is constrained to an atomic target and a small file set, with a fixed summary of changes, verification, and handoff. Similar loops trigger strategy changes, and a review model checks every third round.' },
    outcome: { zh: '命令行与 Web 面板共用同一份运行状态，用户可以暂停、恢复，也能在任务中途把新反馈送入下一轮。', en: 'CLI and web dashboard share one run state, allowing pause, resume, and mid-run feedback for the next iteration.' },
    result: { zh: '完成 v2.0 多引擎循环、审核、失败恢复与实时日志主流程。', en: 'Delivered the v2.0 multi-engine loop, review, failure recovery, and live-log workflow.' },
    nextStep: { zh: '继续减少无限循环的错觉，把完成条件和人工接管点做得更明确。', en: 'Make completion criteria and human takeover points more explicit so continuity does not masquerade as progress.' },
    accent: 'from-[rgba(82,99,78,0.19)] via-[rgba(190,157,94,0.07)] to-transparent',
    externalLinks: [{ label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/code_loop' }],
    detailSections: [{ title: { zh: '持续运行不等于无人负责', en: 'Continuous does not mean unsupervised' }, paragraphs: [{ zh: '我给循环加了 SPEC 门控、定期审核和反馈注入，目的就是让人随时知道它为什么还在跑。恢复机制保存的是状态和证据，不只是把上一条命令再执行一次。', en: 'Spec gates, periodic review, and feedback injection exist so a person can still tell why the loop is running. Recovery restores state and evidence, not merely the last command.' }] }],
  }),
  compactProject({
    slug: 'skill-locator',
    year: '2026',
    category: { zh: 'Agent 基础设施 / Python', en: 'Agent Infrastructure / Python' },
    title: { zh: 'skill-locator', en: 'skill-locator' },
    subtitle: { zh: '跨 Codex、项目和自定义目录找到同名 Skill 的确切位置', en: 'Find the exact location of a skill across Codex, projects, and custom roots' },
    summary: { zh: 'Skill 装多了以后，最浪费时间的事情之一就是找它到底落在哪。这个零依赖 Python 工具会扫描用户级、项目级、Codex 和自定义目录，解析 SKILL.md 元信息，再用表格、JSON 或纯路径输出。', en: 'Once many skills are installed, locating the active copy becomes surprisingly costly. This zero-dependency Python tool scans user, project, Codex, and custom roots, parses SKILL.md metadata, and returns a table, JSON, or one clean path.' },
    role: { zh: 'CLI 设计、跨平台路径解析、元信息读取与可组合输出', en: 'CLI design, cross-platform path resolution, metadata parsing, and composable output' },
    capabilities: [{ zh: '零依赖跨平台扫描', en: 'Zero-dependency cross-platform scan' }, { zh: '范围与精确匹配', en: 'Scoped and exact matching' }, { zh: 'JSON / Path 输出', en: 'JSON and path output' }],
    challenge: { zh: '同名 Skill 可能同时存在于用户目录和项目目录。只打印第一个命中会隐藏冲突，写死 HOME 路径又会让工具换台机器就失效。', en: 'The same skill may exist in user and project scopes. Returning only the first match hides conflicts, while hard-coded home paths break portability.' },
    approach: { zh: '路径从当前工作区和用户目录动态解析，每个命中都会带范围、绝对路径和 SKILL.md 状态。退出码、JSON 和单路径模式方便 Agent 或 CI 继续处理。', en: 'Roots are resolved from the current workspace and user directory. Every match includes its scope, absolute path, and SKILL.md state; exit codes, JSON, and path-only modes remain easy to compose.' },
    outcome: { zh: '工具可以直接作为 Skill 安装，也可以单独运行，不需要 pip install。', en: 'The tool can be installed as a skill or run directly without pip install.' },
    result: { zh: '完成 Windows、macOS、Linux 兼容的定位器和统一输出协议。', en: 'Delivered a Windows, macOS, and Linux-compatible locator with a consistent output contract.' },
    nextStep: { zh: '增加重复版本比较，让“找到了两个”进一步变成“应该用哪一个”。', en: 'Add duplicate-version comparison so “two copies found” can lead to a safer choice.' },
    accent: 'from-[rgba(117,96,69,0.18)] via-[rgba(190,157,94,0.07)] to-transparent',
    externalLinks: [{ label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/skill-locator' }],
    detailSections: [{ title: { zh: '小工具也应该有明确协议', en: 'Small tools still need a clear contract' }, paragraphs: [{ zh: '这个项目的价值不在算法，而在输出稳定。人看表格，Agent 读 JSON，Shell 管道只要路径，三种使用方式不必互相迁就。', en: 'The value is not an algorithm; it is a stable output contract. People get a table, agents get JSON, and shell pipelines get one path without forcing those consumers into the same format.' }] }],
  }),
  compactProject({
    slug: 'idea-create-everything',
    year: '2025',
    category: { zh: 'AI 产品 / 项目规划', en: 'AI Product / Project Planning' },
    title: { zh: 'Idea Create Everything', en: 'Idea Create Everything' },
    subtitle: { zh: '把一个模糊想法拆成可以编辑、搜索和导出的项目树', en: 'Turn a vague idea into an editable, researchable, exportable project tree' },
    summary: { zh: '这个项目从“我有一个想法，但不知道先做什么”出发。AI 负责给出第一版分解，用户在树形编辑器里移动、增删和补充节点，还可以调用联网搜索给市场与竞品节点补资料。', en: 'The project starts from “I have an idea but do not know what to do first.” AI proposes an initial breakdown, the user edits it as a tree, and web search can add evidence to market or competitor nodes.' },
    role: { zh: '产品原型、树形信息架构、FastAPI 后端与 Next.js 前端', en: 'Product prototype, tree information architecture, FastAPI backend, and Next.js frontend' },
    capabilities: [{ zh: 'AI 创意分解', en: 'AI idea breakdown' }, { zh: '可视化树编辑', en: 'Visual tree editing' }, { zh: '搜索与多格式导出', en: 'Search and multi-format export' }],
    challenge: { zh: 'AI 很擅长快速列提纲，但提纲常常过于完整，看不出优先级，也不方便在人做出新判断以后重排。', en: 'AI can draft outlines quickly, but those outlines often look falsely complete, hide priority, and resist reordering after a human judgment changes.' },
    approach: { zh: '生成结果不是一篇长文，而是可拖动的多级节点。Claude 提供建议，Brave Search 给外部资料，最终结构可以导出 Markdown、JSON 或思维导图。', en: 'The output is a draggable hierarchy instead of a long document. Claude offers suggestions, Brave Search adds external material, and the final structure exports to Markdown, JSON, or a mind map.' },
    outcome: { zh: '形成了从想法输入、结构分解、资料补充到导出的完整原型。', en: 'Completed a full prototype from initial idea through decomposition, research, and export.' },
    result: { zh: '完成 FastAPI + Next.js 14 双端原型，并提供 Docker Compose 启动链路。', en: 'Delivered a FastAPI and Next.js 14 prototype with Docker Compose startup.' },
    nextStep: { zh: '减少模板带来的“看起来很完整”，让依赖、风险和首个可验证结果更早出现。', en: 'Reduce template-driven false completeness and surface dependencies, risks, and the first testable result earlier.' },
    accent: 'from-[rgba(109,82,60,0.18)] via-[rgba(190,157,94,0.07)] to-transparent',
    externalLinks: [{ label: { zh: '查看源码', en: 'View on GitHub' }, url: 'https://github.com/MarcusDog/Idea_create_everything' }],
    detailSections: [{ title: { zh: '树比长回答更容易继续改', en: 'A tree is easier to revise than a long answer' }, paragraphs: [{ zh: '项目结构会在调研和实现中不断变化。节点可以单独移动、补充来源或标记完成，用户不需要每次都让模型重写整篇计划。', en: 'Project structure changes throughout research and implementation. Individual nodes can move, gain sources, or be completed without asking the model to rewrite the entire plan.' }] }],
  }),
  compactProject({
    slug: 'personal-publication',
    year: '2026',
    category: { zh: '个人网站 / 内容系统', en: 'Personal Site / Publishing System' },
    title: { zh: '小天 Aya · 个人网站', en: 'XiaoTian Aya · Personal Publication' },
    subtitle: { zh: '这一次不再把网站当简历，而是当作长期维护的个人出版物', en: 'A personal site rebuilt as a maintained publication rather than a frozen résumé' },
    summary: { zh: '现在这个网站本身也是一个项目。前台负责作品、日志和个人介绍，私有 Studio 可以写 Markdown、保存草稿、上传图片、发布和检索文章；项目资料也改成可继续扩充的结构化内容。', en: 'This site is a project in its own right. The public side presents work, journal entries, and background, while a private Studio handles Markdown, drafts, image uploads, publishing, and searchable content.' },
    role: { zh: '内容策略、视觉系统、React 前端、Express / SQLite 内容后台与部署整理', en: 'Content strategy, visual system, React frontend, Express/SQLite CMS, and deployment preparation' },
    capabilities: [{ zh: '双语作品档案', en: 'Bilingual work archive' }, { zh: '私有写作后台', en: 'Private writing studio' }, { zh: '草稿、发布、标签与搜索', en: 'Drafts, publishing, tags, and search' }],
    challenge: { zh: '旧网站能展示几张图，却很难持续添加项目和文章。久而久之，做过的东西比网站里看到的多很多。', en: 'The old site could show a few screenshots but made ongoing publishing difficult. Over time, the actual body of work grew much larger than what the site showed.' },
    approach: { zh: '视觉上保留暖白、石墨和鎏金质感，内容上把“精选几个”改成“重点案例 + 完整档案”。日志由 SQLite 管理，后台使用 HttpOnly 会话，写作与最终阅读排版共用同一套 Markdown 规则。', en: 'The visual system keeps warm ivory, graphite, and restrained gold, while content moves from a few selected items to major case studies plus a complete archive. SQLite manages the journal, HttpOnly sessions protect the Studio, and editing shares Markdown rules with the reading view.' },
    outcome: { zh: '网站变成可以继续写、继续加项目的工具，而不是一次重构后再次冻结的页面。', en: 'The site becomes a tool that can keep accepting writing and project work instead of freezing after one redesign.' },
    result: { zh: '完成响应式前台、项目案例系统和带登录、草稿、发布、上传的 Journal Studio。', en: 'Delivered the responsive public site, project case-study system, and Journal Studio with login, drafts, publishing, and uploads.' },
    nextStep: { zh: '继续把真实项目资料补齐，并让 AI 只做可审阅的排版与润色建议。', en: 'Continue filling the archive with real project evidence and keep AI assistance reviewable.' },
    accent: 'from-[rgba(186,145,76,0.22)] via-[rgba(110,87,58,0.08)] to-transparent',
    detailSections: [{ title: { zh: '网站要能跟上做事的速度', en: 'The site should keep up with the work' }, paragraphs: [{ zh: '这次重构最重要的不是换一套配色，而是降低更新成本。项目数据、截图和文章都可以按同一套结构继续加入，重点项目有完整案例，较小的工具也不会因为不够“精选”而消失。', en: 'The important change is not a new palette; it is a lower cost of maintenance. Projects, screenshots, and articles can keep joining the same structure, with full case studies for major work and a visible place for smaller tools.' }] }],
  }),
]
