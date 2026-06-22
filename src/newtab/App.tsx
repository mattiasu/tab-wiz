import { useEffect, useRef, useState } from 'react'
import { useStore } from '../hooks/useStore'
import { useSearch } from '../hooks/useSearch'
import CategoryColumn from '../components/CategoryColumn'
import SearchResults from '../components/SearchResults'
import QuickRuleModal from '../components/QuickRuleModal'
import type { SearchResult } from '../hooks/useSearch'
import { switchToTab } from '../lib/tabs'

export default function App() {
  const { loading, groupedTabs, allTabs, categories, init, syncFromStorage, addPatternToCategory } = useStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [quickRuleTab, setQuickRuleTab] = useState<chrome.tabs.Tab | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = useSearch(query, allTabs)

  useEffect(() => { init() }, [init])
  useEffect(() => { setSelectedIndex(0) }, [query])

  useEffect(() => {
    const onVisible = () => { if (!document.hidden) syncFromStorage() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [syncFromStorage])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) activate(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  async function activate(result: SearchResult) {
    if (result.type === 'tab' && result.tabId !== undefined) {
      await switchToTab(result.tabId, result.windowId)
    } else {
      window.location.href = result.url
    }
  }

  async function handleConfirmRule(categoryId: string, pattern: string) {
    await addPatternToCategory(categoryId, pattern)
    setQuickRuleTab(null)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-400" style={{ backgroundColor: '#fafafa' }}>
        Loading…
      </div>
    )
  }

  const columns = [...groupedTabs.values()].filter((g) => g.tabs.length > 0)
  const isSearching = query.trim().length > 0

  return (
    <div className="flex min-h-screen flex-col p-6" style={{ backgroundColor: '#fafafa' }}>
      <div className="mx-auto w-full max-w-2xl">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search open tabs or history…"
          className="w-full rounded-xl bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 outline-none ring-1 ring-zinc-200 focus:ring-indigo-400 transition-shadow shadow-sm"
        />
      </div>

      <div className="flex-1">
        {isSearching ? (
          <SearchResults
            results={results}
            selectedIndex={selectedIndex}
            onActivate={activate}
          />
        ) : (
          <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
            {columns.length === 0 ? (
              <p className="text-zinc-400">No tabs open.</p>
            ) : (
              columns.map(({ category, tabs }) => (
                <CategoryColumn
                  key={category.id}
                  category={category}
                  tabs={tabs}
                  onAssignToCategory={setQuickRuleTab}
                />
              ))
            )}
          </div>
        )}
      </div>

      <footer className="mt-6 flex items-center gap-3 text-xs text-zinc-400">
        <img src="/icons/icon16.png" alt="" className="h-4 w-4" />
        <span className="font-medium text-zinc-500">Tab Wiz</span>
        <span>·</span>
        <a
          href="settings.html"
          target="_blank"
          rel="noreferrer"
          className="hover:text-zinc-600 transition-colors"
        >
          Settings
        </a>
      </footer>

      {quickRuleTab && (
        <QuickRuleModal
          tab={quickRuleTab}
          categories={categories}
          onConfirm={handleConfirmRule}
          onClose={() => setQuickRuleTab(null)}
        />
      )}
    </div>
  )
}
