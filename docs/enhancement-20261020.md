# 2026-10-20 更新与回归记录

## 本次更新

- 首页、关于和文章署名统一使用用户提供的原始头像，保留原件；原件 SHA-256 与提供文件一致，仅额外生成响应式 WebP。
- 米白基础上增加克制的红蓝重点色；关于页关注卡片、合作按钮、带说明的页脚导航、RSS 与联系入口统一尺寸。
- 添加 4 篇附原始来源的技术分析；新增 6 本科技／人文书目，全部为“想读”、零阅读进度，不虚构阅读经历。
- 综合 RSS 14 条（8 篇文章、6 本书），另有文章、读书独立源；全文安全渲染，既有文章标识不变，修改草稿不影响公开正文或公开更新时间。
- 写作台新增模板追加、Markdown 源码、专注模式、结构目录、字数与预计时长、发布检查清单、快捷保存和内容状态筛选。源码与可视化共用文档结构。
- 留言页提供 6 种话题、关联项目、时间／预算与联系偏好、话题提纲、本机正文草稿。后台支持搜索、已读筛选、复制联系信息与邮件回复。留言不公开，不进入订阅。

## 窄屏预览问题

用户看到的“左侧手机宽度、右侧大块空白”由测试浏览器的视口覆盖造成：实际窗口 1707px，手机测试仍保留 390px 的页面视口；页面还留在已清理的测试文章编辑状态。此问题不是内容容器 CSS 的再次回归。

已关闭该验收窗口，重新打开 `garden-preview` 可见预览，使用 `scripts/garden-preview.config.json` 的 `viewport: null`，页面随真实窗口变化。核对 `innerWidth === outerWidth === 1707`，根容器 1692px（扣除滚动条），桌面布局正常。

手机与缩放测试改由 `scripts/run-garden-check.mjs` 启动独立无头浏览器；成功或失败均关闭测试浏览器。测试不会再调整用户的可见预览。`scripts/restore-garden-preview.js` 拒绝固定尺寸测试上下文，作为真实窗口预览断言。

```powershell
# 独立隐藏浏览器执行布局与 RSS 检查
node scripts/run-garden-check.mjs scripts/garden-enhancement-check.js

# 留言和写作交互验收，凭据只在本机读取，不写进脚本
node scripts/run-garden-check.mjs scripts/garden-enhancement-interactions.js --studio

# 可见预览，禁止在此会话执行 setViewportSize
npx --yes --package @playwright/cli playwright-cli -s=garden-preview open http://localhost:4191/ --config=scripts/garden-preview.config.json --headed
```

## 验证

- Vitest：7 文件、35 项测试通过；Lint 通过；正式构建通过。编辑器独立分包仍有超过 500kB 的非阻断构建提示。
- 浏览器：360、390、768、1024、1440、1920px 的 8 个页面，125%／150% 缩放，以及 3 个 XML 订阅源，共 53 项检查通过。没有异常横向溢出、坏图或 XML 解析错误。
- 完整交互：选择话题／提纲 → 提交私信 → 后台搜索与标记已读；模板 → 源码 → 快捷保存 → 结构化文档 → 可视化恢复 → 专注与 Esc → 预览 → 发布 → RSS 更新，通过。
- 公开接口与订阅中未出现测试私信、联系方式或未发布草稿。测试文章与测试留言已清理，保留原有 16 个项目与全部旧文章。
- SQLite 完整性检查为 `ok`；更新前备份为 `server/data/backups/enhancement-20261019-1792425279838/personweb.db`，备份校验通过，保留更新前 4 篇文章和 16 个项目。
- 当前模型未配置密钥，AI 接口仍需服务端配置；不声称完成真实模型调用。统一提示词已补充技术证据与真实阅读状态规则。

截图在 `output/playwright/`：`restored-desktop-preview.png`、`enhanced-about-1440.png`、`enhanced-contact-390.png`、`enhanced-reading-1440.png`、`enhanced-studio-1440.png` 等。截图中的 QA 文章仅用于流程验收，现已删除。
