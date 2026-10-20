import { useEffect, useState } from 'react'

import { getJournalEntries } from '../lib/content'
import { fetchPublishedJournal } from '../lib/journalApi'
import type { JournalEntry } from '../types/content'

const staticEntries = getJournalEntries()
let cachedEntries: JournalEntry[] | null = null

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>(cachedEntries || staticEntries)
  const [source, setSource] = useState<'static' | 'live'>(cachedEntries ? 'live' : 'static')

  useEffect(() => {
    if (import.meta.env.MODE === 'test') return
    let active = true
    fetchPublishedJournal()
      .then((liveEntries) => {
        if (!active) return
        cachedEntries = liveEntries
        setEntries(liveEntries)
        setSource('live')
      })
      .catch(() => {
        // The static archive keeps the public site usable while the API is offline.
      })
    return () => {
      active = false
    }
  }, [])

  return { entries, source }
}
