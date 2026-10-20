# 本地重构验收 · 2026-10-19

## 运行入口

- 网站：<http://localhost:4191/?v=garden-20261019>
- 写作台：<http://localhost:4191/studio>
- 账号 `xiaotian`，随机密码见本机 `server/data/admin-secret.txt`。不要将凭据提交到 Git。
- 维护说明：[写作台与内容维护](garden-implementation.md)。本次没有推送 GitHub 或部署线上。

## 已验证

- `pnpm test`：6 个测试文件，24 项通过。覆盖中文发布、草稿／发布隔离、撤回、迁移幂等、结构化文档、Markdown 转换、目录、页面入口与素材来源分类。
- `pnpm lint`、`pnpm build` 通过。构建仍有写作台代码块大小提示，约 556KB、gzip 174KB；写作台与公开页面分开加载，该提示不是构建失败。
- `pnpm audit` 与更新后的 npm 锁文件审计均未报告已知漏洞。
- 360、390、768、1024、1440、1920px：12 个关键页面逐一检查，72 次页面检查未见横向溢出、失效图片或错误路由；另验证 125%／150% CSS 缩放。这里验证的是浏览器内布局缩放，不代表操作系统显示缩放认证。
- 16 个项目分别在 390px、1440px 检查，共 32 次详情检查，全部图片可读取，未出现横向溢出。
- 搜索写入 URL，刷新和浏览器返回后保留；全站搜索、主题持久化、手机菜单 Escape、图集键盘切换／关闭／焦点约束通过。手机文章目录默认折叠，桌面展开。
- 真实浏览器走通：登录 → 中文文章 → Markdown 导入 → 上传／粘贴／拖入图片 → 自动保存 → 预览 → 发布 → 修改草稿隔离 → 更新发布 → 撤回。
- 随想、书籍和项目的新增、编辑、前台读取与服务重启后的保留通过。无效图片上传被拒绝。测试记录和 6 份未引用的验收图片已清理。
- 打开旧文章不会自动生成修改草稿；原有 4 篇文章、16 个项目保留。书架与随想没有导入虚构记录。
- RSS、动态 sitemap、管理鉴权、HTML 重新校验缓存、非哈希素材重新校验与写作台 noindex 响应头通过。

## 视觉与内容

首页按已选定的“你好，我是小天＋插画头像”构图，正文、按钮与卡片都是网页组件。米白底、宋体标题、无衬线正文，以及统一宽度和留白覆盖所有公开页面与写作台。

食灶录采用多张真实竖屏界面，VoiceDesk、Ainews、Flow Socket、LearningByDoing、OpenClaw 和个人网站使用真实界面。AI Closet 与 WeChat Auto 的说明素材标为设计稿；其余缺少完整界面的项目使用明确标注的概念封面。生成／未分类素材不会自动被标成真实截图。

关于页移除无关截图墙，合作页区分个人作品和商业交付，不使用未经核实的用户规模、节省时长和交付统计。文案及模型提示词遵循 humanizer-zh 的自然、具体、不补造事实的口径。

## 仍需配置

本地没有模型密钥，因此未声称完成真实模型调用。排版、润色、摘要、翻译及连接测试的接口与统一提示词已经接入；设置 `LLM_API_KEY`、`LLM_BASE_URL`、`LLM_MODEL` 并重启后启用。已验证未配置／失败时原稿不变，建议必须预览后采用，并可撤销。

首次改造前的数据库与上传素材备份位于 `server/data/backups/pre-garden-20261019`。以后请定期使用 SQLite backup API 备份数据库，并备份 `public/uploads`。

## 截图

以下为工作区中的本地截图，均在 `output/playwright/`：

- 首页：`home-viewport-1440.png`、`home-viewport-390.png`；完整页 `home-1440.png`、`home-390.png`。
- 文章：`journal-1440.png`、`journal-390.png`。
- 项目：`projects-1440.png`、`projects-390.png`、`projects-shizaolu-1440.png`、`projects-voicedesk-1440.png`。
- 写作台：`studio-editor-desktop.png`、`studio-editor-mobile.png`、`studio-settings-mobile.png`。
- 深色与缩放：`home-dark-1440.png`、`home-zoom-1.25.png`、`home-zoom-1.5.png`。
