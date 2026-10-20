import type { JournalEntry } from '../types/content'
import { extractMarkdownHeadings } from './markdown'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface JournalDraft {
  id?: string
  slug: string
  status: 'draft' | 'published'
  date: string
  categoryZh: string
  categoryEn: string
  titleZh: string
  titleEn: string
  standfirstZh: string
  standfirstEn: string
  bodyZh: string
  bodyEn: string
  tags: string[]
  coverImage?: string
}

export type LlmTask = 'format' | 'polish' | 'summarize' | 'translate'

export interface LlmStatus {
  configured: boolean
  model: string | null
  endpoint: string
}

export interface LlmRewriteResult {
  title: string
  standfirst: string
  body: string
  tags: string[]
  model: string
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  const payload = (await response.json()) as ApiResponse<T>
  if (!response.ok || !payload.success) throw new Error(payload.error || '请求失败')
  return payload.data
}

export function hydrateJournalEntry(entry: Omit<JournalEntry, 'headings'>): JournalEntry {
  return {
    ...entry,
    tags: entry.tags || [],
    headings: {
      zh: extractMarkdownHeadings(entry.body.zh),
      en: extractMarkdownHeadings(entry.body.en),
    },
  }
}

export async function fetchPublishedJournal() {
  const entries = await apiFetch<Array<Omit<JournalEntry, 'headings'>>>('/api/journal')
  return entries.map(hydrateJournalEntry)
}

export async function fetchAdminPosts() {
  const entries = await apiFetch<Array<Omit<JournalEntry, 'headings'>>>('/api/admin/posts')
  return entries.map(hydrateJournalEntry)
}

export async function checkAdminSession() {
  return apiFetch<{ authenticated: boolean; username: string | null }>('/api/admin/session')
}

export async function loginAdmin(username: string, password: string) {
  return apiFetch<{ username: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function logoutAdmin() {
  await apiFetch<undefined>('/api/admin/logout', { method: 'POST' })
}

export function entryToDraft(entry: JournalEntry): JournalDraft {
  return {
    id: entry.id,
    slug: entry.slug,
    status: entry.status || 'published',
    date: entry.date,
    categoryZh: entry.category.zh,
    categoryEn: entry.category.en,
    titleZh: entry.title.zh,
    titleEn: entry.title.en,
    standfirstZh: entry.standfirst.zh,
    standfirstEn: entry.standfirst.en,
    bodyZh: entry.body.zh,
    bodyEn: entry.body.en,
    tags: entry.tags || [],
    coverImage: entry.coverImage,
  }
}

export async function saveAdminPost(draft: JournalDraft) {
  const url = draft.id ? `/api/admin/posts/${draft.id}` : '/api/admin/posts'
  const entry = await apiFetch<Omit<JournalEntry, 'headings'>>(url, {
    method: draft.id ? 'PUT' : 'POST',
    body: JSON.stringify(draft),
  })
  return hydrateJournalEntry(entry)
}

export async function deleteAdminPost(id: string) {
  await apiFetch<undefined>(`/api/admin/posts/${id}`, { method: 'DELETE' })
}

export async function uploadJournalImage(file: File) {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('图片读取失败'))
    reader.readAsDataURL(file)
  })
  return apiFetch<{ url: string }>('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify({ dataUrl }),
  })
}

export async function fetchLlmStatus() {
  return apiFetch<LlmStatus>('/api/admin/llm/status')
}

export async function rewriteWithLlm(input: {
  task: LlmTask
  language: 'zh' | 'en'
  title: string
  standfirst: string
  body: string
  tags: string[]
}) {
  return apiFetch<LlmRewriteResult>('/api/admin/llm/rewrite', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
