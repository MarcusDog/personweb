import {
  ArrowLeft,
  Check,
  Eye,
  FilePlus2,
  ImagePlus,
  LogOut,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'

import { usePageTitle } from '../hooks/usePageTitle'
import {
  checkAdminSession,
  deleteAdminPost,
  entryToDraft,
  fetchAdminPosts,
  fetchLlmStatus,
  loginAdmin,
  logoutAdmin,
  rewriteWithLlm,
  saveAdminPost,
  uploadJournalImage,
} from '../lib/journalApi'
import type { JournalDraft, LlmRewriteResult, LlmStatus, LlmTask } from '../lib/journalApi'
import type { JournalEntry, Language } from '../types/content'

const today = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function emptyDraft(): JournalDraft {
  return {
    slug: '',
    status: 'draft',
    date: today(),
    categoryZh: '笔记',
    categoryEn: 'Note',
    titleZh: '',
    titleEn: '',
    standfirstZh: '',
    standfirstEn: '',
    bodyZh: '',
    bodyEn: '',
    tags: [],
  }
}

function structureMarkdown(source: string, title: string) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const result: string[] = []
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (result.at(-1) !== '') result.push('')
      continue
    }
    if (/^(#{1,6}|[-*+]\s|\d+\.\s|>|```)/.test(line)) {
      result.push(line)
      continue
    }
    if (line.length <= 28 && /[:：]$/.test(line)) {
      result.push(`## ${line.replace(/[:：]$/, '')}`)
      continue
    }
    if (/^[一二三四五六七八九十]+[、.]/.test(line)) {
      result.push(`### ${line.replace(/^[一二三四五六七八九十]+[、.]\s*/, '')}`)
      continue
    }
    result.push(line)
  }
  const formatted = result.join('\n').replace(/\n{3,}/g, '\n\n').trim()
  if (!formatted) return title ? `## ${title}\n\n从这里开始写。` : '## 正文\n\n从这里开始写。'
  return /^#{2,3}\s/m.test(formatted) ? formatted : `## ${title || '正文'}\n\n${formatted}`
}

function AdminLogin({ onSuccess }: { onSuccess: (username: string) => void }) {
  const [username, setUsername] = useState('xiaotian')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const session = await loginAdmin(username, password)
      onSuccess(session.username)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '登录失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="admin-shell flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-[2rem] border border-[var(--border-subtle)] bg-[rgba(255,253,248,0.86)] p-7 shadow-[0_30px_90px_rgba(61,45,26,0.12)] backdrop-blur-xl md:p-10">
        <Link className="safe-touch inline-flex items-center brand-ui text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]" to="/">
          ← 返回网站
        </Link>
        <p className="mt-14 text-xs uppercase tracking-[0.24em] text-[var(--accent-soft)]">Private studio</p>
        <h1 className="brand-display mt-3 text-4xl font-black tracking-[-0.04em] text-[var(--text-strong)]">写作后台</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">这里是小天的私人编辑室。登录后可以写作、预览、保存草稿和发布文章。</p>
        <form className="mt-9 space-y-5" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.1em] text-[var(--text-muted)]">账号</span>
            <input className="admin-input" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs tracking-[0.1em] text-[var(--text-muted)]">密码</span>
            <input className="admin-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button className="safe-touch flex w-full items-center justify-center rounded-xl bg-[#171512] px-5 py-3.5 text-sm text-[#fffaf0] transition hover:bg-[#2b2721] disabled:opacity-50" disabled={busy} type="submit">
            {busy ? '正在进入…' : '进入编辑室'}
          </button>
        </form>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</span>
      {children}
    </label>
  )
}

function PostEditor({
  initial,
  onBack,
  onSaved,
  onDeleted,
}: {
  initial: JournalDraft
  onBack: () => void
  onSaved: (entry: JournalEntry) => void
  onDeleted: (id: string) => void
}) {
  const [draft, setDraft] = useState(initial)
  const [language, setLanguage] = useState<Language>('zh')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [llmStatus, setLlmStatus] = useState<LlmStatus | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<{
    task: LlmTask
    targetLanguage: Language
    result: LlmRewriteResult
  } | null>(null)
  const body = language === 'zh' ? draft.bodyZh : draft.bodyEn
  const title = language === 'zh' ? draft.titleZh : draft.titleEn

  useEffect(() => {
    if (draft.id) return
    const timeout = window.setTimeout(() => localStorage.setItem('personweb-studio-draft', JSON.stringify(draft)), 500)
    return () => window.clearTimeout(timeout)
  }, [draft])

  useEffect(() => {
    fetchLlmStatus().then(setLlmStatus).catch(() => setLlmStatus(null))
  }, [])

  function setField<Key extends keyof JournalDraft>(key: Key, value: JournalDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setMessage('')
  }

  async function save(status: 'draft' | 'published') {
    setBusy(true)
    setError('')
    try {
      const entry = await saveAdminPost({ ...draft, status })
      setDraft(entryToDraft(entry))
      localStorage.removeItem('personweb-studio-draft')
      setMessage(status === 'published' ? '文章已发布' : '草稿已保存')
      onSaved(entry)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '保存失败')
    } finally {
      setBusy(false)
    }
  }

  function autoFormat() {
    const bodyKey = language === 'zh' ? 'bodyZh' : 'bodyEn'
    setField(bodyKey, structureMarkdown(body, title))
    setMessage('已按标题与段落规则整理，可继续微调')
  }

  async function runAiTask(task: LlmTask) {
    if (!llmStatus?.configured) {
      if (task === 'format') {
        autoFormat()
        setMessage('未配置模型，已使用本地排版规则')
      } else {
        setError('写作模型尚未配置。请先在 .env 中设置 LLM_API_KEY 与 LLM_MODEL。')
      }
      return
    }

    setBusy(true)
    setError('')
    setMessage('')
    try {
      const standfirst = language === 'zh' ? draft.standfirstZh : draft.standfirstEn
      const result = await rewriteWithLlm({ task, language, title, standfirst, body, tags: draft.tags })
      setAiSuggestion({ task, targetLanguage: task === 'translate' ? (language === 'zh' ? 'en' : 'zh') : language, result })
      setMessage('AI 建议已生成，确认后才会写入')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '模型处理失败')
    } finally {
      setBusy(false)
    }
  }

  function applyAiSuggestion() {
    if (!aiSuggestion) return
    const { result, targetLanguage } = aiSuggestion
    setDraft((current) => ({
      ...current,
      [targetLanguage === 'zh' ? 'titleZh' : 'titleEn']: result.title || (targetLanguage === 'zh' ? current.titleZh : current.titleEn),
      [targetLanguage === 'zh' ? 'standfirstZh' : 'standfirstEn']: result.standfirst || (targetLanguage === 'zh' ? current.standfirstZh : current.standfirstEn),
      [targetLanguage === 'zh' ? 'bodyZh' : 'bodyEn']: result.body || (targetLanguage === 'zh' ? current.bodyZh : current.bodyEn),
      tags: result.tags.length ? result.tags : current.tags,
    }))
    setLanguage(targetLanguage)
    setAiSuggestion(null)
    setMessage('已采用 AI 建议，发布前请再通读一遍')
  }

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const { url } = await uploadJournalImage(file)
      setField('coverImage', url)
      const bodyKey = language === 'zh' ? 'bodyZh' : 'bodyEn'
      setField(bodyKey, `${body}\n\n![${title || '文章图片'}](${url})\n`)
      setMessage('图片已上传，并插入正文末尾')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '上传失败')
    } finally {
      setBusy(false)
      event.target.value = ''
    }
  }

  async function remove() {
    if (!draft.id || !window.confirm('确定永久删除这篇文章吗？这个操作无法撤销。')) return
    setBusy(true)
    try {
      await deleteAdminPost(draft.id)
      onDeleted(draft.id)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '删除失败')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-[rgba(250,247,241,0.9)] px-4 py-3 backdrop-blur-xl md:px-7">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
          <button className="safe-touch inline-flex items-center gap-2 text-sm text-[var(--text-soft)]" onClick={onBack} type="button"><ArrowLeft size={16} />文章列表</button>
          <div className="flex items-center gap-2">
            {message && <span className="hidden items-center gap-1 text-xs text-emerald-700 sm:inline-flex"><Check size={14} />{message}</span>}
            <button className="admin-action-secondary" disabled={busy} onClick={() => save('draft')} type="button"><Save size={15} />保存草稿</button>
            <button className="admin-action-primary" disabled={busy} onClick={() => save('published')} type="button">{draft.status === 'published' ? '更新发布' : '发布文章'}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-7 md:py-10">
        {error && <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full border border-[var(--border-subtle)] bg-white/50 p-1">
            {(['zh', 'en'] as Language[]).map((item) => (
              <button key={item} className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] ${language === item ? 'bg-[#171512] text-white' : 'text-[var(--text-muted)]'}`} onClick={() => setLanguage(item)} type="button">{item}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-2 text-[0.68rem] ${llmStatus?.configured ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[var(--border-subtle)] bg-white/50 text-[var(--text-muted)]'}`}>
              {llmStatus?.configured ? `AI · ${llmStatus.model}` : '本地排版'}
            </span>
            <button className="admin-action-secondary" disabled={busy} onClick={() => void runAiTask('format')} type="button"><Sparkles size={15} />AI 排版</button>
            <button className="admin-action-secondary" disabled={busy} onClick={() => void runAiTask('polish')} type="button">润色</button>
            <button className="admin-action-secondary" disabled={busy} onClick={() => void runAiTask('summarize')} type="button">写摘要</button>
            <button className="admin-action-secondary" disabled={busy} onClick={() => void runAiTask('translate')} type="button">中英互译</button>
            <label className="admin-action-secondary cursor-pointer"><ImagePlus size={15} />上传图片<input className="sr-only" accept="image/png,image/jpeg,image/webp,image/gif" onChange={upload} type="file" /></label>
            <button className="admin-action-secondary lg:hidden" onClick={() => setShowPreview((value) => !value)} type="button"><Eye size={15} />{showPreview ? '隐藏预览' : '显示预览'}</button>
          </div>
        </div>

        {aiSuggestion && (
          <section className="mb-6 rounded-[1.5rem] border border-[var(--accent-soft)] bg-[var(--accent-wash)] p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">AI suggestion · {aiSuggestion.result.model}</p>
                <h2 className="brand-display mt-2 text-xl font-bold text-[var(--text-strong)]">建议稿不会自动覆盖原文</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">目标语言：{aiSuggestion.targetLanguage === 'zh' ? '中文' : 'English'}。先检查标题、摘要和正文，再决定是否采用。</p>
              </div>
              <div className="flex gap-2">
                <button className="admin-action-secondary" onClick={() => setAiSuggestion(null)} type="button">放弃</button>
                <button className="admin-action-primary" onClick={applyAiSuggestion} type="button">采用建议</button>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-white/65 p-4">
                <p className="text-xs text-[var(--text-muted)]">标题与摘要</p>
                <p className="mt-3 font-semibold leading-7 text-[var(--text-strong)]">{aiSuggestion.result.title || '（保留原标题）'}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{aiSuggestion.result.standfirst || '（保留原摘要）'}</p>
              </div>
              <div className="max-h-64 overflow-auto rounded-xl border border-[var(--border-subtle)] bg-white/65 p-4">
                <p className="text-xs text-[var(--text-muted)]">Markdown 正文预览</p>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-7 text-[var(--text-soft)]">{aiSuggestion.result.body}</pre>
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)]">
          <section className="rounded-[1.6rem] border border-[var(--border-subtle)] bg-white/55 p-5 md:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={language === 'zh' ? '中文标题' : 'English title'}>
                <input className="admin-input" value={title} onChange={(event) => setField(language === 'zh' ? 'titleZh' : 'titleEn', event.target.value)} />
              </Field>
              <Field label="发布日期"><input className="admin-input" type="date" value={draft.date} onChange={(event) => setField('date', event.target.value)} /></Field>
              <Field label={language === 'zh' ? '中文分类' : 'English category'}>
                <input className="admin-input" value={language === 'zh' ? draft.categoryZh : draft.categoryEn} onChange={(event) => setField(language === 'zh' ? 'categoryZh' : 'categoryEn', event.target.value)} />
              </Field>
              <Field label="链接 Slug"><input className="admin-input" placeholder="留空将根据英文标题生成" value={draft.slug} onChange={(event) => setField('slug', event.target.value)} /></Field>
            </div>
            <div className="mt-5">
              <Field label={language === 'zh' ? '中文摘要' : 'English standfirst'}>
                <textarea className="admin-input min-h-24 resize-y" value={language === 'zh' ? draft.standfirstZh : draft.standfirstEn} onChange={(event) => setField(language === 'zh' ? 'standfirstZh' : 'standfirstEn', event.target.value)} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label="标签（用逗号分隔）">
                <input className="admin-input" value={draft.tags.join(', ')} onChange={(event) => setField('tags', event.target.value.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean))} />
              </Field>
            </div>
            <div className="mt-5">
              <Field label={`${language === 'zh' ? '中文正文' : 'English body'} · Markdown`}>
                <textarea className="admin-editor" spellCheck={false} value={body} onChange={(event) => setField(language === 'zh' ? 'bodyZh' : 'bodyEn', event.target.value)} />
              </Field>
            </div>
            {draft.id && (
              <button className="mt-7 inline-flex items-center gap-2 text-xs text-red-600/70 transition hover:text-red-700" disabled={busy} onClick={remove} type="button"><Trash2 size={14} />删除文章</button>
            )}
          </section>

          <aside className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 overflow-hidden rounded-[1.6rem] border border-[var(--border-subtle)] bg-[#fffdf8] shadow-[0_24px_70px_rgba(61,45,26,0.08)]">
              {draft.coverImage && <img className="aspect-[16/8] w-full object-cover" src={draft.coverImage} alt="" />}
              <div className="p-6 md:p-9">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--accent-soft)]">{language === 'zh' ? draft.categoryZh : draft.categoryEn} · {draft.date}</p>
                <h2 className="brand-display mt-4 text-3xl font-black leading-tight tracking-[-0.035em] text-[var(--text-strong)]">{title || '文章标题会显示在这里'}</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--text-soft)]">{language === 'zh' ? draft.standfirstZh : draft.standfirstEn}</p>
                <div className="reading-prose mt-9 text-[0.96rem]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || '## 开始写作\n\n右侧会实时显示排版后的文章。'}</ReactMarkdown>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export function AdminStudioPage() {
  usePageTitle('写作后台 | 小天Aya')
  const [username, setUsername] = useState<string | null>(null)
  const [checking, setChecking] = useState(import.meta.env.MODE !== 'test')
  const [posts, setPosts] = useState<JournalEntry[]>([])
  const [editing, setEditing] = useState<JournalDraft | null>(null)
  const [error, setError] = useState('')

  async function loadPosts() {
    try {
      setPosts(await fetchAdminPosts())
      setError('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '读取文章失败')
    }
  }

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      return
    }
    checkAdminSession()
      .then((session) => {
        if (!session.authenticated || !session.username) return []
        setUsername(session.username)
        return fetchAdminPosts()
      })
      .then(setPosts)
      .catch(() => undefined)
      .finally(() => setChecking(false))
  }, [])

  const counts = useMemo(() => ({
    published: posts.filter((post) => post.status === 'published').length,
    draft: posts.filter((post) => post.status === 'draft').length,
  }), [posts])

  function startNew() {
    const saved = localStorage.getItem('personweb-studio-draft')
    if (saved) {
      try {
        setEditing({ ...emptyDraft(), ...JSON.parse(saved), id: undefined })
        return
      } catch {
        localStorage.removeItem('personweb-studio-draft')
      }
    }
    setEditing(emptyDraft())
  }

  if (checking) return <main className="admin-shell flex min-h-screen items-center justify-center text-sm text-[var(--text-muted)]">正在打开编辑室…</main>
  if (!username) return <AdminLogin onSuccess={(name) => { setUsername(name); void loadPosts() }} />
  if (editing) {
    return <PostEditor initial={editing} onBack={() => setEditing(null)} onSaved={(entry) => setPosts((current) => [entry, ...current.filter((post) => post.id !== entry.id)])} onDeleted={(id) => { setPosts((current) => current.filter((post) => post.id !== id)); setEditing(null) }} />
  }

  return (
    <main className="admin-shell min-h-screen px-5 py-7 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <Link className="safe-touch inline-flex items-center text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]" to="/">小天Aya / 返回网站</Link>
            <h1 className="brand-display mt-5 text-4xl font-black tracking-[-0.04em] text-[var(--text-strong)] md:text-6xl">Journal Studio</h1>
            <p className="mt-3 text-sm text-[var(--text-soft)]">你好，{username}。把正在发生的事写下来。</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="admin-action-secondary" onClick={async () => { await logoutAdmin(); setUsername(null) }} type="button"><LogOut size={15} />退出</button>
            <button className="admin-action-primary" onClick={startNew} type="button"><FilePlus2 size={15} />写新文章</button>
          </div>
        </header>

        <section className="mt-12 grid gap-px overflow-hidden rounded-[1.6rem] border border-[var(--border-subtle)] bg-[var(--border-subtle)] sm:grid-cols-3">
          <div className="bg-[#fffdf8] p-6"><p className="text-xs tracking-[0.12em] text-[var(--text-muted)]">全部文章</p><p className="brand-display mt-4 text-4xl font-black">{posts.length}</p></div>
          <div className="bg-[#fffdf8] p-6"><p className="text-xs tracking-[0.12em] text-[var(--text-muted)]">已经发布</p><p className="brand-display mt-4 text-4xl font-black">{counts.published}</p></div>
          <div className="bg-[#fffdf8] p-6"><p className="text-xs tracking-[0.12em] text-[var(--text-muted)]">还在草稿</p><p className="brand-display mt-4 text-4xl font-black">{counts.draft}</p></div>
        </section>

        {error && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
            <h2 className="brand-display text-2xl font-black">文章</h2>
            <span className="text-xs text-[var(--text-muted)]">点击任意一篇继续编辑</span>
          </div>
          <div className="space-y-2">
            {posts.map((post) => (
              <button key={post.id || post.slug} className="group grid w-full gap-3 rounded-[1.2rem] border border-transparent px-4 py-5 text-left transition hover:border-[var(--border-subtle)] hover:bg-white/60 md:grid-cols-[7rem_minmax(0,1fr)_8rem] md:items-center" onClick={() => setEditing(entryToDraft(post))} type="button">
                <span className="text-xs text-[var(--text-muted)]">{post.date}</span>
                <span>
                  <span className="brand-display block text-lg font-bold text-[var(--text-strong)]">{post.title.zh}</span>
                  <span className="mt-1 block text-xs text-[var(--text-muted)]">/{post.slug}</span>
                </span>
                <span className={`w-fit rounded-full px-3 py-1 text-[0.68rem] ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{post.status === 'published' ? '已发布' : '草稿'}</span>
              </button>
            ))}
            {!posts.length && <button className="w-full rounded-[1.5rem] border border-dashed border-[var(--border-subtle)] px-6 py-16 text-center text-sm text-[var(--text-muted)]" onClick={startNew} type="button">还没有文章，从第一篇开始。</button>}
          </div>
        </section>
      </div>
    </main>
  )
}
