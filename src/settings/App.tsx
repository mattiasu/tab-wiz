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

  function deleteCategory(id: string) {
    setCategories(categories.filter((c) => c.id !== id))
  }

  function addCategory() {
    const usedColors = new Set(categories.map((c) => c.color))
    const color = PALETTE.find((c) => !usedColors.has(c)) ?? PALETTE[0]
    const next: Category = {
      id: randomId(),
      name: 'New Category',
      color,
      patterns: [],
      order: categories.length,
    }
    setCategories([...categories, next])
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#fafafa' }}>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold tracking-tight text-zinc-900">
          Tab Wiz — Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Categories match top-to-bottom — first match wins. Tabs with no match won't appear in any column.
        </p>
        <p className="mt-3 mb-8 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-700 ring-1 ring-amber-100">
          The categories below are <strong>examples</strong> — rename, delete, or replace them entirely to match your own workflow.
        </p>

        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <CategoryEditor
              key={cat.id}
              category={cat}
              canDelete={categories.length > 1}
              onChange={updateCategory}
              onDelete={() => deleteCategory(cat.id)}
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
