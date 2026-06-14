import { useEffect, useRef, useState } from 'react'
import type { Category } from '../lib/rules'
import { suggestPatterns } from '../lib/categoriser'

interface Props {
  tab: chrome.tabs.Tab
  categories: Category[]
  onConfirm: (categoryId: string, pattern: string) => void
  onClose: () => void
}

export default function QuickRuleModal({ tab, categories, onConfirm, onClose }: Props) {
  const url = tab.url ?? ''
  const suggestions = suggestPatterns(url)
  const [pattern, setPattern] = useState(suggestions[0] ?? '')
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id ?? '')
  const patternRef = useRef<HTMLInputElement>(null)

  let hostname = ''
  try { hostname = new URL(url).hostname } catch {}

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function confirm() {
    const p = pattern.trim()
    if (!p || !selectedCategoryId) return
    onConfirm(selectedCategoryId, p)
  }

  const favicon = tab.favIconUrl && !tab.favIconUrl.startsWith('chrome://') ? tab.favIconUrl : null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/25" onClick={onClose} />

      <div className="fixed left-1/2 top-1/2 z-50 w-96 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-zinc-200">
        <h2 className="text-sm font-semibold text-zinc-900">Assign to category</h2>

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 ring-1 ring-zinc-100">
          {favicon
            ? <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded-sm" />
            : <div className="h-4 w-4 shrink-0 rounded-sm bg-zinc-200" />
          }
          <span className="truncate text-xs text-zinc-500">{tab.title || hostname}</span>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Category</p>
          <div className="mt-1.5 flex flex-col gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedCategoryId === cat.id
                    ? 'bg-zinc-100 font-medium text-zinc-900 ring-1 ring-zinc-200'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">URL pattern</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setPattern(s); patternRef.current?.focus() }}
                className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
                  pattern === s
                    ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            ref={patternRef}
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirm()}
            className="mt-2 w-full rounded-lg bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-800 outline-none ring-1 ring-zinc-200 focus:ring-indigo-400 transition-shadow"
            placeholder="*example.com/*"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!pattern.trim() || !selectedCategoryId}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            Add rule
          </button>
        </div>
      </div>
    </>
  )
}
