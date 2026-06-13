import { useState, useEffect } from 'react'

export interface SearchResult {
  type: 'tab' | 'history'
  title: string
  url: string
  favIconUrl?: string
  tabId?: number
  windowId?: number
}

export function useSearch(query: string, tabs: chrome.tabs.Tab[]): SearchResult[] {
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const q = query.toLowerCase()

    const matchingTabs = tabs.filter(
      (t) =>
        (t.title ?? '').toLowerCase().includes(q) ||
        (t.url ?? '').toLowerCase().includes(q),
    )

    const tabResults: SearchResult[] = matchingTabs.map((t) => ({
      type: 'tab',
      title: t.title ?? t.url ?? '',
      url: t.url ?? '',
      favIconUrl: t.favIconUrl,
      tabId: t.id,
      windowId: t.windowId,
    }))

    const openUrls = new Set(matchingTabs.map((t) => t.url))

    // Show tab matches immediately, history arrives shortly after
    setResults(tabResults)

    const timer = setTimeout(async () => {
      const items = await chrome.history.search({ text: query, maxResults: 20 })
      const historyResults: SearchResult[] = items
        .filter((item) => item.url && !openUrls.has(item.url))
        .map((item) => ({
          type: 'history' as const,
          title: item.title || item.url || '',
          url: item.url ?? '',
        }))
      setResults([...tabResults, ...historyResults])
    }, 150)

    return () => clearTimeout(timer)
  }, [query, tabs])

  return results
}
