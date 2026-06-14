import { useEffect } from 'react'
import { useStore } from '../hooks/useStore'
import CategoryEditor from './CategoryEditor'
import type { Category } from '../lib/rules'

const PALETTE = [
  '#6366f1', '#f59e0b', '#0ea5e9', '#22c55e',
  '#ef4444', '#ec4899', '#8b5cf6', '#14b8a6',
]

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

export default function App() {
  const { categories, init, setCategories } = useStore()

  useEffect(() => { init() }, [init])

  function updateCategory(updated: Category) {
    setCategories(categories.map((c) => (c.id === updated.id ? updated : c)))
  }

  function normalize(cats: Category[]): Category[] {
    return cats.map((c, i) => ({ ...c, order: i }))
  }

  function sorted() {
    return [...categories].sort((a, b) => a.order - b.order)
  }

  function deleteCategory(id: string) {
    setCategories(normalize(sorted().filter((c) => c.id !== id)))
  }

  function moveCategory(id: string, direction: 'up' | 'down') {
    const s = sorted()
    const idx = s.findIndex((c) => c.id === id)
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= s.length) return
    const reordered = [...s]
    ;[reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]]
    setCategories(normalize(reordered))
  }

  function addCategory() {
    const usedColors = new Set(categories.map((c) => c.color))
    const color = PALETTE.find((c) => !usedColors.has(c)) ?? PALETTE[0]
    const next: Category = { id: randomId(), name: 'New Category', color, patterns: [], order: 0 }
    setCategories(normalize([...sorted(), next]))
  }

  const sortedCategories = sorted()

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#fafafa' }}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold tracking-tight text-zinc-900">
          Tab Wiz — Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Categories match top-to-bottom — first match wins. Tabs with no match won't appear in any column.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {sortedCategories.map((cat, idx) => (
            <CategoryEditor
              key={cat.id}
              category={cat}
              canDelete={categories.length > 1}
              onChange={updateCategory}
              onDelete={() => deleteCategory(cat.id)}
              onMoveUp={idx > 0 ? () => moveCategory(cat.id, 'up') : undefined}
              onMoveDown={idx < sortedCategories.length - 1 ? () => moveCategory(cat.id, 'down') : undefined}
            />
          ))}
        </div>

        <button
          onClick={addCategory}
          className="mt-4 w-full rounded-xl border-2 border-dashed border-zinc-200 py-3 text-sm text-zinc-400 transition-colors hover:border-indigo-300 hover:text-indigo-500"
        >
          + Add category
        </button>

        <p className="mt-6 text-xs text-zinc-400">
          Changes save automatically to your Chrome profile.
        </p>
      </div>
    </div>
  )
}
