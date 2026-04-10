class MemoryStorage {
  private store = new Map<string, string>()

  clear() {
    this.store.clear()
  }

  getItem(key: string) {
    return this.store.get(key) ?? null
  }

  key(index: number) {
    return [...this.store.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.store.delete(key)
  }

  setItem(key: string, value: string) {
    this.store.set(key, value)
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
})

Object.defineProperty(globalThis, 'navigator', {
  value: {
    language: 'en-US',
    userAgent: 'vitest',
    clipboard: { writeText: async () => undefined },
  },
  configurable: true,
})

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  value: true,
  configurable: true,
})
