import { useState } from 'react'
import type { Category } from '../lib/rules'

interface Props {
  category: Category
  canDelete: boolean
  onChange: (updated: Category) => void
  onDelete: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export default function CategoryEditor({ category, canDelete, onChange, onDelete, onMoveUp, onMoveDown }: Props) {
  const [newPattern, setNewPattern] = useState('')
  const [editingPattern, setEditingPattern] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  function startEdit(pattern: string) {
    setEditingPattern(pattern)
    setEditValue(pattern)
  }

  function commitEdit(original: string) {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== original && !category.patterns.includes(trimmed)) {
      onChange({ ...category, patterns: category.patterns.map((p) => (p === original ? trimmed : p)) })
    }
    setEditingPattern(null)
  }

  function addPattern() {
    const p = newPattern.trim()
    if (!p || category.patterns.includes(p)) return
    onChange({ ...category, patterns: [...category.patterns, p] })
    setNewPattern('')
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-zinc-200">
      <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-lg">
          <input
            type="color"
            value={category.color}
            onChange={(e) => onChange({ ...category, color: e.target.value })}
            className="absolute -inset-1 h-8 w-8 cursor-pointer border-0 p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
            title="Category colour"
          />
        </div>
        <input
          type="text"
          value={category.name}
          onChange={(e) => onChange({ ...category, name: e.target.value })}
          className="flex-1 bg-transparent text-sm font-medium text-zinc-900 outline-none placeholder-zinc-300"
          placeholder="Category name"
        />
        <div className="flex items-center gap-0.5">
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="rounded px-1 py-0.5 text-xs text-zinc-300 transition-colors hover:text-zinc-600 disabled:opacity-25 disabled:pointer-events-none"
            title="Move up"
          >
            ↑
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="rounded px-1 py-0.5 text-xs text-zinc-300 transition-colors hover:text-zinc-600 disabled:opacity-25 disabled:pointer-events-none"
            title="Move down"
          >
            ↓
          </button>
        </div>
        {canDelete && (
          <button
            onClick={onDelete}
            className="text-xs text-zinc-300 transition-colors hover:text-red-500"
          >
            Delete
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">URL patterns</p>

        {category.patterns.length === 0 && (
          <p className="text-xs text-zinc-300 italic">No patterns — this category will never match.</p>
        )}

        {category.patterns.map((pattern) => (
          <div key={pattern} className="group flex items-center gap-2">
            {editingPattern === pattern ? (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => commitEdit(pattern)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(pattern)
                  if (e.key === 'Escape') setEditingPattern(null)
                }}
                className="flex-1 rounded bg-zinc-50 px-2 py-1 font-mono text-sm text-zinc-700 outline-none ring-1 ring-indigo-300 focus:ring-indigo-400"
              />
            ) : (
              <code
                onClick={() => startEdit(pattern)}
                className="flex-1 cursor-text rounded bg-zinc-50 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100 hover:ring-1 hover:ring-zinc-200 transition-colors"
                title="Click to edit"
              >
                {pattern}
              </code>
            )}
            <button
              onClick={() =>
                onChange({ ...category, patterns: category.patterns.filter((p) => p !== pattern) })
              }
              className="text-zinc-300 opacity-0 transition-colors hover:text-red-500 group-hover:opacity-100"
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}

        <div className="mt-1 flex items-center gap-2">
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPattern()}
            placeholder="*example.com/*"
            className="flex-1 rounded bg-zinc-50 px-2 py-1 text-sm text-zinc-700 outline-none ring-1 ring-zinc-100 placeholder-zinc-300 focus:ring-indigo-300"
          />
          <button
            onClick={addPattern}
            disabled={!newPattern.trim()}
            className="text-sm font-medium text-indigo-500 transition-colors hover:text-indigo-700 disabled:text-zinc-300"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
