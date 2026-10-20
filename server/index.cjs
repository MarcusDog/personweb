const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const Database = require('better-sqlite3')
const cors = require('cors')
const dotenv = require('dotenv')
const express = require('express')
const helmet = require('helmet')
const { buildEditorialMessages } = require('./prompts/editorial-assistant.cjs')

const rootDir = path.resolve(__dirname, '..')
dotenv.config({ path: path.join(rootDir, '.env') })

const app = express()
const PORT = Number(process.env.PORT || 3001)
const dataDir = process.env.PERSONWEB_DATA_DIR || path.join(__dirname, 'data')
const uploadDir = path.join(rootDir, 'public', 'uploads')
const distDir = path.join(rootDir, 'dist')
const llmConfig = {
  apiKey: process.env.LLM_API_KEY || '',
  baseUrl: (process.env.LLM_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, ''),
  model: process.env.LLM_MODEL || '',
}

fs.mkdirSync(dataDir, { recursive: true })
fs.mkdirSync(uploadDir, { recursive: true })

app.disable('x-powered-by')
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' }, contentSecurityPolicy: { directives: { imgSrc: ["'self'", 'data:', 'https://covers.openlibrary.org', 'https://archive.org', 'https://*.archive.org', 'https://books.google.com', 'https://books.googleusercontent.com'] } } }))
app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      const allowed = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
        .split(',')
        .map((item) => item.trim())
      callback(null, allowed.includes(origin))
    },
  }),
)
app.use(express.json({ limit: '8mb' }))
app.use('/uploads', express.static(uploadDir, { maxAge: '7d', immutable: false }))

const db = new Database(path.join(dataDir, 'personweb.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    role TEXT NOT NULL,
    delivery TEXT NOT NULL,
    problem TEXT NOT NULL,
    timeline TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    language TEXT DEFAULT 'zh',
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'unread'
  );

  CREATE TABLE IF NOT EXISTS journal_posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    date TEXT NOT NULL,
    category_zh TEXT NOT NULL,
    category_en TEXT NOT NULL,
    title_zh TEXT NOT NULL,
    title_en TEXT NOT NULL,
    standfirst_zh TEXT NOT NULL,
    standfirst_en TEXT NOT NULL,
    body_zh TEXT NOT NULL,
    body_en TEXT NOT NULL,
    tags TEXT NOT NULL DEFAULT '[]',
    cover_image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME
  );

  CREATE INDEX IF NOT EXISTS idx_journal_status_date
  ON journal_posts(status, date DESC);
`)

function parseFrontmatter(source) {
  const normalized = source.replace(/\r\n?/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null
  const meta = Object.fromEntries(
    match[1]
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const index = line.indexOf(':')
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()]
      }),
  )
  const [zhBlock = '', enBlock = ''] = match[2].split(/<!--lang:en-->/)
  return {
    meta,
    bodyZh: zhBlock.replace(/<!--lang:zh-->/, '').trim(),
    bodyEn: enBlock.trim(),
  }
}

function seedJournal() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM journal_posts').get().count
  if (count > 0) return

  const journalDir = path.join(rootDir, 'src', 'content', 'journal')
  if (!fs.existsSync(journalDir)) return

  const insert = db.prepare(`
    INSERT OR IGNORE INTO journal_posts (
      id, slug, status, date, category_zh, category_en, title_zh, title_en,
      standfirst_zh, standfirst_en, body_zh, body_en, tags, published_at
    ) VALUES (
      @id, @slug, 'published', @date, @categoryZh, @categoryEn, @titleZh, @titleEn,
      @standfirstZh, @standfirstEn, @bodyZh, @bodyEn, @tags, CURRENT_TIMESTAMP
    )
  `)

  const seedAll = db.transaction(() => {
    for (const filename of fs.readdirSync(journalDir).filter((name) => name.endsWith('.md'))) {
      const parsed = parseFrontmatter(fs.readFileSync(path.join(journalDir, filename), 'utf8'))
      if (!parsed?.meta.slug) continue
      insert.run({
        id: crypto.randomUUID(),
        slug: parsed.meta.slug,
        date: parsed.meta.date,
        categoryZh: parsed.meta.categoryZh,
        categoryEn: parsed.meta.categoryEn,
        titleZh: parsed.meta.titleZh,
        titleEn: parsed.meta.titleEn,
        standfirstZh: parsed.meta.standfirstZh,
        standfirstEn: parsed.meta.standfirstEn,
        bodyZh: parsed.bodyZh,
        bodyEn: parsed.bodyEn,
        tags: JSON.stringify([parsed.meta.categoryZh, parsed.meta.categoryEn]),
      })
    }
  })
  seedAll()
}

seedJournal()

function createLocalAdminPassword() {
  const secretFile = path.join(dataDir, 'admin-secret.txt')
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD
  if (fs.existsSync(secretFile)) return fs.readFileSync(secretFile, 'utf8').trim()
  const generated = crypto.randomBytes(12).toString('base64url')
  fs.writeFileSync(secretFile, generated, { encoding: 'utf8', mode: 0o600 })
  console.log(`\n首次启动已创建管理员账号。\n用户名: ${process.env.ADMIN_USERNAME || 'xiaotian'}\n临时密码保存在服务器本地凭据文件中，不写入日志。\n请读取 ${secretFile}，并在 .env 中设置 ADMIN_PASSWORD 后重启服务。\n`)
  return generated
}

const adminUsername = process.env.ADMIN_USERNAME || 'xiaotian'
const adminPassword = createLocalAdminPassword()
const sessions = new Map()
const loginAttempts = new Map()

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left))
  const rightBuffer = Buffer.from(String(right))
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function parseCookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf('=')
        return [decodeURIComponent(item.slice(0, index)), decodeURIComponent(item.slice(index + 1))]
      }),
  )
}

function requireAdmin(req, res, next) {
  const token = parseCookies(req.headers.cookie).personweb_session
  const session = token ? sessions.get(token) : null
  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token)
    return res.status(401).json({ success: false, error: '请先登录管理后台' })
  }
  session.expiresAt = Date.now() + 12 * 60 * 60 * 1000
  next()
}

function parseTags(value) {
  if (Array.isArray(value)) return value.map(String).map((tag) => tag.trim()).filter(Boolean).slice(0, 12)
  try {
    return JSON.parse(value || '[]')
  } catch {
    return []
  }
}

function postToJson(row, includeBody = true) {
  const post = {
    id: row.id,
    slug: row.slug,
    status: row.status,
    date: row.date,
    category: { zh: row.category_zh, en: row.category_en },
    title: { zh: row.title_zh, en: row.title_en },
    standfirst: { zh: row.standfirst_zh, en: row.standfirst_en },
    tags: parseTags(row.tags),
    coverImage: row.cover_image || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
  }
  if (includeBody) post.body = { zh: row.body_zh, en: row.body_en }
  return post
}

function slugify(value) {
  const ascii = String(value || '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
  return ascii || `note-${new Date().toISOString().slice(0, 10)}-${crypto.randomBytes(2).toString('hex')}`
}

function validatePost(body) {
  const required = ['date', 'categoryZh', 'categoryEn', 'titleZh', 'titleEn', 'standfirstZh', 'standfirstEn', 'bodyZh', 'bodyEn']
  const missing = required.filter((key) => !String(body[key] || '').trim())
  if (missing.length) return `缺少字段：${missing.join(', ')}`
  if (!['draft', 'published'].includes(body.status)) return '文章状态无效'
  return null
}

function parseModelJson(value) {
  const source = String(value || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  const start = source.indexOf('{')
  const end = source.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('模型没有返回可解析的 JSON')
  const parsed = JSON.parse(source.slice(start, end + 1))
  if (!parsed || typeof parsed !== 'object') throw new Error('模型返回格式无效')
  return {
    title: String(parsed.title || '').trim(),
    standfirst: String(parsed.standfirst || '').trim(),
    body: String(parsed.body || '').trim(),
    tags: parseTags(parsed.tags),
  }
}

async function callEditorialModel(messages) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45_000)
  const payload = {
    model: llmConfig.model,
    messages,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  }

  try {
    let response
    for (let attempt = 0; attempt < 2; attempt += 1) {
      response = await fetch(`${llmConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${llmConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      if (response.status === 400 && attempt === 0 && payload.response_format) {
        delete payload.response_format
        continue
      }
      if (response.ok || ![429, 500, 502, 503, 504].includes(response.status) || attempt === 1) break
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)))
    }
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`模型请求失败（${response.status}）${detail ? `：${detail.slice(0, 180)}` : ''}`)
    }
    const payloadResult = await response.json()
    const content = payloadResult?.choices?.[0]?.message?.content
    return parseModelJson(content)
  } finally {
    clearTimeout(timeout)
  }
}

require('./garden-cms.cjs').installGardenCms({app,db,requireAdmin,rootDir,callEditorialModel,buildEditorialMessages,llmConfig})

app.get('/api/journal', (req, res) => {
  const rows = db
    .prepare("SELECT * FROM journal_posts WHERE status = 'published' ORDER BY date DESC, published_at DESC")
    .all()
  res.json({ success: true, data: rows.map((row) => postToJson(row, true)) })
})

app.get('/api/journal/:slug', (req, res) => {
  const row = db
    .prepare("SELECT * FROM journal_posts WHERE slug = ? AND status = 'published'")
    .get(req.params.slug)
  if (!row) return res.status(404).json({ success: false, error: '文章不存在' })
  res.json({ success: true, data: postToJson(row, true) })
})

app.post('/api/admin/login', (req, res) => {
  const key = req.ip || 'unknown'
  const attempt = loginAttempts.get(key) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 }
  if (attempt.resetAt < Date.now()) {
    attempt.count = 0
    attempt.resetAt = Date.now() + 15 * 60 * 1000
  }
  if (attempt.count >= 8) return res.status(429).json({ success: false, error: '尝试次数过多，请稍后再试' })

  const valid = safeEqual(req.body.username, adminUsername) && safeEqual(req.body.password, adminPassword)
  if (!valid) {
    attempt.count += 1
    loginAttempts.set(key, attempt)
    return res.status(401).json({ success: false, error: '账号或密码不正确' })
  }

  loginAttempts.delete(key)
  const token = crypto.randomBytes(32).toString('base64url')
  sessions.set(token, { expiresAt: Date.now() + 12 * 60 * 60 * 1000 })
  res.setHeader(
    'Set-Cookie',
    `personweb_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  )
  res.json({ success: true, data: { username: adminUsername } })
})

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const token = parseCookies(req.headers.cookie).personweb_session
  if (token) sessions.delete(token)
  res.setHeader('Set-Cookie', 'personweb_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0')
  res.json({ success: true })
})

app.get('/api/admin/session', (req, res) => {
  const token = parseCookies(req.headers.cookie).personweb_session
  const session = token ? sessions.get(token) : null
  const authenticated = Boolean(session && session.expiresAt >= Date.now())
  res.json({ success: true, data: { authenticated, username: authenticated ? adminUsername : null } })
})

app.get('/api/admin/posts', requireAdmin, (req, res) => {
  const rows = db.prepare('SELECT * FROM journal_posts ORDER BY date DESC, updated_at DESC').all()
  res.json({ success: true, data: rows.map((row) => postToJson(row, true)) })
})

app.get('/api/admin/llm/status', requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: {
      configured: Boolean(llmConfig.apiKey && llmConfig.model),
      model: llmConfig.model || null,
      endpoint: llmConfig.baseUrl,
    },
  })
})

app.post('/api/admin/llm/rewrite', requireAdmin, async (req, res) => {
  if (!llmConfig.apiKey || !llmConfig.model) {
    return res.status(503).json({ success: false, error: '尚未配置写作模型，请在 .env 中设置 LLM_API_KEY 与 LLM_MODEL' })
  }
  const { task, language, title = '', standfirst = '', body = '', tags = [] } = req.body || {}
  if (!['format', 'polish', 'summarize', 'translate'].includes(task)) {
    return res.status(400).json({ success: false, error: '不支持的 AI 写作任务' })
  }
  if (!['zh', 'en'].includes(language)) return res.status(400).json({ success: false, error: '语言参数无效' })
  if (!String(title).trim() && !String(body).trim()) return res.status(400).json({ success: false, error: '请先填写标题或正文' })
  if ([title, standfirst, body].join('\n').length > 45_000) return res.status(413).json({ success: false, error: '文章过长，请分段处理' })

  try {
    const messages = buildEditorialMessages({ task, language, title, standfirst, body, tags: parseTags(tags) })
    const result = await callEditorialModel(messages)
    if (String(body).trim() && !result.body) throw new Error('模型返回正文为空，原稿已保留')
    res.json({ success: true, data: { ...result, model: llmConfig.model } })
  } catch (error) {
    const message = error.name === 'AbortError' ? '模型响应超时，请稍后重试' : error.message || '模型处理失败'
    res.status(502).json({ success: false, error: message })
  }
})

app.post('/api/admin/posts', requireAdmin, (req, res) => {
  const error = validatePost(req.body)
  if (error) return res.status(400).json({ success: false, error })
  const slug = slugify(req.body.slug || req.body.titleEn || req.body.titleZh)
  const id = crypto.randomUUID()
  try {
    db.prepare(`
      INSERT INTO journal_posts (
        id, slug, status, date, category_zh, category_en, title_zh, title_en,
        standfirst_zh, standfirst_en, body_zh, body_en, tags, cover_image, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END)
    `).run(
      id, slug, req.body.status, req.body.date, req.body.categoryZh.trim(), req.body.categoryEn.trim(),
      req.body.titleZh.trim(), req.body.titleEn.trim(), req.body.standfirstZh.trim(), req.body.standfirstEn.trim(),
      req.body.bodyZh.trim(), req.body.bodyEn.trim(), JSON.stringify(parseTags(req.body.tags)), req.body.coverImage || null,
      req.body.status,
    )
    res.status(201).json({ success: true, data: postToJson(db.prepare('SELECT * FROM journal_posts WHERE id = ?').get(id)) })
  } catch (databaseError) {
    const message = databaseError.code === 'SQLITE_CONSTRAINT_UNIQUE' ? '这个文章链接已经存在' : '保存失败'
    res.status(409).json({ success: false, error: message })
  }
})

app.put('/api/admin/posts/:id', requireAdmin, (req, res) => {
  const error = validatePost(req.body)
  if (error) return res.status(400).json({ success: false, error })
  const current = db.prepare('SELECT * FROM journal_posts WHERE id = ?').get(req.params.id)
  if (!current) return res.status(404).json({ success: false, error: '文章不存在' })
  const slug = slugify(req.body.slug || req.body.titleEn || req.body.titleZh)
  try {
    db.prepare(`
      UPDATE journal_posts SET
        slug = ?, status = ?, date = ?, category_zh = ?, category_en = ?, title_zh = ?, title_en = ?,
        standfirst_zh = ?, standfirst_en = ?, body_zh = ?, body_en = ?, tags = ?, cover_image = ?,
        updated_at = CURRENT_TIMESTAMP,
        published_at = CASE
          WHEN ? = 'published' AND published_at IS NULL THEN CURRENT_TIMESTAMP
          WHEN ? = 'draft' THEN NULL
          ELSE published_at
        END
      WHERE id = ?
    `).run(
      slug, req.body.status, req.body.date, req.body.categoryZh.trim(), req.body.categoryEn.trim(),
      req.body.titleZh.trim(), req.body.titleEn.trim(), req.body.standfirstZh.trim(), req.body.standfirstEn.trim(),
      req.body.bodyZh.trim(), req.body.bodyEn.trim(), JSON.stringify(parseTags(req.body.tags)), req.body.coverImage || null,
      req.body.status, req.body.status, req.params.id,
    )
    res.json({ success: true, data: postToJson(db.prepare('SELECT * FROM journal_posts WHERE id = ?').get(req.params.id)) })
  } catch (databaseError) {
    const message = databaseError.code === 'SQLITE_CONSTRAINT_UNIQUE' ? '这个文章链接已经存在' : '保存失败'
    res.status(409).json({ success: false, error: message })
  }
})

app.delete('/api/admin/posts/:id', requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM journal_posts WHERE id = ?').run(req.params.id)
  if (!result.changes) return res.status(404).json({ success: false, error: '文章不存在' })
  res.json({ success: true })
})

app.post('/api/admin/upload', requireAdmin, (req, res) => {
  const match = String(req.body.dataUrl || '').match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/)
  if (!match) return res.status(400).json({ success: false, error: '仅支持 PNG、JPEG、WebP 或 GIF 图片' })
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > 5 * 1024 * 1024) return res.status(413).json({ success: false, error: '图片不能超过 5MB' })
  const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }[match[1]]
  const filename = `${Date.now()}-${crypto.randomBytes(5).toString('hex')}.${extension}`
  fs.writeFileSync(path.join(uploadDir, filename), buffer)
  res.status(201).json({ success: true, data: { url: `/uploads/${filename}` } })
})

if (!db.prepare('PRAGMA table_info(contacts)').all().some(column => column.name === 'metadata')) db.exec("ALTER TABLE contacts ADD COLUMN metadata TEXT NOT NULL DEFAULT '{}'")
const contactAttempts = new Map()
app.post('/api/contact/submit', (req, res) => {
  const { role, delivery, problem, timeline, contact, language = 'zh' } = req.body
  if (!role || !delivery || !problem || !timeline || !contact) {
    return res.status(400).json({ success: false, error: '所有字段均为必填项' })
  }
  if ([role, delivery, problem, timeline, contact].some(value => typeof value !== 'string') || String(problem).trim().length < 5 || String(problem).length > 5000 || String(contact).trim().length < 3 || String(contact).length > 200 || String(role).length > 80 || String(delivery).length > 100 || String(timeline).length > 100) return res.status(400).json({ success: false, error: '请检查留言内容与联系方式，正文需要 5–5000 个字。' })
  if (req.body.website) return res.status(400).json({ success: false, error: '请使用页面上的留言表单。' })
  const now = Date.now(), ip = req.ip || 'unknown'
  for (const [key, attempts] of contactAttempts) if (attempts.every(time => now - time >= 15 * 60 * 1000)) contactAttempts.delete(key)
  const recent = (contactAttempts.get(ip) || []).filter(time => now - time < 15 * 60 * 1000)
  if (recent.length >= 5) return res.status(429).json({ success: false, error: '留言发送得有些频繁，请稍后再试，或直接发邮件。' })
  contactAttempts.set(ip, [...recent, now])
  const metadata = Object.fromEntries(['project', 'budget', 'contactMethod'].map(key => [key, String(req.body.metadata?.[key] || '').slice(0, 200)]))
  const id = `contact_${Date.now()}_${crypto.randomBytes(5).toString('hex')}`
  db.prepare(`
    INSERT INTO contacts (id, role, delivery, problem, timeline, contact_info, language, ip_address, user_agent, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, role.trim(), delivery.trim(), problem.trim(), timeline.trim(), contact.trim(), language === 'en' ? 'en' : 'zh', req.ip, req.headers['user-agent'] || '', JSON.stringify(metadata))
  res.json({ success: true, message: '已收到你的留言。', id })
})

app.get('/api/admin/contacts', requireAdmin, (req, res) => {
  const contacts = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 100').all()
  res.json({ success: true, data: contacts, total: contacts.length })
})

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() })
})

if (fs.existsSync(distDir)) {
  app.use('/studio',(_req,res,next)=>{res.setHeader('X-Robots-Tag','noindex, nofollow');next()})
  app.use(express.static(distDir, { setHeaders(res, file) {
    const hashedAsset=path.dirname(file)===path.join(distDir,'assets') && /-[\w-]+\.(?:js|css)$/.test(file)
    res.setHeader('Cache-Control',hashedAsset?'public, max-age=31536000, immutable':'no-cache')
  } }))
  app.get('*splat', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next()
    res.setHeader('Cache-Control','no-cache')
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

const server = app.listen(PORT, () => {
  console.log(`PersonWeb server listening on http://localhost:${PORT}`)
})

function closeServer() {
  server.close(() => {
    db.close()
    process.exit(0)
  })
}

process.on('SIGTERM', closeServer)
process.on('SIGINT', closeServer)
