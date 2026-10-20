# 小天 Aya · Personal Website

一个以个人记录为主的 React、Express、SQLite 网站。首页采用“你好，我是小天”与独立插画头像，文章、随想、书架和项目都可以在私人写作台更新。详细操作见 [写作台与内容维护](docs/garden-implementation.md)。

当前版本 **v1.1.0 · 写作台增强版**：[更新记录](CHANGELOG.md) · [新功能使用说明](docs/studio-v1.1.0.md)。

## 已实现

- 米白、宋体标题和无衬线正文；1120px 内容宽度、740px 文章正文
- 浅色、深色、跟随系统主题；手机菜单、全站搜索和显式管理入口
- 中文 / English 双语切换
- 保留 16 个项目档案；真实截图、设计稿和概念封面明确区分，截图支持放大
- Journal 分类、全文搜索、标签、文章目录、阅读时长与分享链接
- `/studio` 管理员后台
  - 登录与 12 小时 HttpOnly 会话
  - 新建、编辑、草稿、发布、撤回和删除文章／随想／书籍／项目
  - 中文即可发布，英文选填
  - Tiptap 可视化编辑器、图片、表格、代码块和 Markdown 导入导出
  - 可选的 AI 排版、去 AI 腔润色、摘要与中英互译；建议稿确认后才写入
  - PNG / JPEG / WebP / GIF 图片上传（单张不超过 5MB）
  - 服务端自动保存与本机恢复；修改草稿和已发布快照隔离
  - 最近 60 版历史、预览与恢复到草稿；内容复制为独立草稿
  - 可撤销查找替换、字数目标、发布前提示与内容备份导出
- 素材库、站点设置、模型连接测试与留言已读管理
- 动态 RSS、sitemap，以及入口页重新校验缓存
- 文章 / 读书分流订阅、全文 RSS；新增 4 篇有来源的技术分析和 6 本科技、人文想读书目
- 原始头像、克制的红蓝强调色；带文字说明的页脚与更明确的合作入口
- 写作模板、专注模式、Markdown 源码、字数与目录、发布检查清单、Ctrl / ⌘ S 快捷保存
- 六类私密留言、关联项目与时间预算选项、正文草稿恢复；后台搜索与回复入口
- SQLite 内容数据库；首次启动会自动导入 `src/content/journal/*.md`
- 联系表单持久化与受保护的联系人接口
- API 不可用时，公开站点自动回退到仓库内的静态 Markdown 内容

## 本地运行

推荐 Node.js 24 LTS 与 pnpm 10；如需使用内置环境代理，Node.js 至少为 24.5。

可见预览与自动化测试必须分开：使用 `scripts/garden-preview.config.json`（`viewport: null`）打开可随窗口调整的桌面预览；回归运行 `node scripts/run-garden-check.mjs scripts/garden-enhancement-check.js`，它会新建独立无头浏览器并在结束后关闭。不要对用户正在看的预览调用 `setViewportSize`。

```bash
pnpm install
copy .env.example .env
pnpm dev:server
pnpm dev
```

- 网站：`http://localhost:5173`
- 后端：`http://localhost:3001`
- 写作后台：`http://localhost:5173/studio`

请在 `.env` 中设置强密码：

```env
ADMIN_USERNAME=xiaotian
ADMIN_PASSWORD=your-long-random-password
ALLOWED_ORIGINS=https://xiaotianaya.com,http://localhost:5173
LLM_API_KEY=
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=
```

如果没有提供 `ADMIN_PASSWORD`，服务首次启动时会在 `server/data/admin-secret.txt` 生成随机密码并打印一次提示。`server/data/` 已被 Git 忽略。

写作台的 AI 功能使用 OpenAI-compatible `chat/completions` 接口。没有配置 `LLM_API_KEY` 和 `LLM_MODEL` 时，写作与发布不受影响；AI 按钮会提示配置，原稿不会改变，不会冒充已运行模型。统一提示词与边界见 [docs/llm-editorial-assistant.md](docs/llm-editorial-assistant.md)。

## 生产部署

```bash
pnpm build
pnpm check:publication
NODE_ENV=production pnpm start
```

Express 会同时提供构建后的 SPA、`/api` 接口与 `/uploads` 图片。生产环境应通过 HTTPS 反向代理到 3001 端口，并持久化：

- `server/data/`
- `public/uploads/`

PM2 示例位于 `ecosystem.config.cjs`。

## 内容数据

公开站点从 `/api/site` 读取四类已发布内容。首次启动按 slug 导入既有文章与项目，之后不覆盖后台编辑；下架和删除的内容不会在下次启动重新出现。服务暂时离线时，前端可使用仓库静态内容回退，动态写入仍需 Express 服务。

## 验证

奶油暖金升级、自动书封使用方法及桌面／手机验收材料见 [本次交付记录](docs/warm-gold-20261020.md)。

```bash
pnpm test
pnpm lint
pnpm build
```
