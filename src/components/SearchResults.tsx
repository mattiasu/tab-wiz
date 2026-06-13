import { useEffect, useRef } from 'react'
import type { SearchResult } from '../hooks/useSearch'

interface Props {
  results: SearchResult[]
  selectedIndex: number
  onActivate: (result: SearchResult) => void
}

function getFavicon(result: SearchResult): string {
  if (result.favIconUrl && !result.favIconUrl.startsWith('chrome://')) {
    return result.favIconUrl
  }
  try {
    const { hostname } = new URL(result.url)
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return ''
  }
}

export default function SearchResults({ results, selectedIndex, onActivate }: Props) {
  const selectedRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  if (results.length === 0) {
    return <p className="mt-8 text-center text-sm text-zinc-400">No results</p>
  }

  return (
    <div className="mx-auto mt-3 w-full max-w-2xl flex flex-col gap-0.5">
      {results.map((result, i) => {
        const favicon = getFavicon(result)
        const isSelected = i === selectedIndex

        return (
          <button
            key={`${result.type}-${result.url}-${i}`}
            ref={isSelected ? selectedRef : null}
            onClick={() => onActivate(result)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none ${
              isSelected
                ? 'bg-white shadow-sm ring-1 ring-zinc-200'
                : 'hover:bg-white hover:shadow-sm'
            }`}
          >
            {favicon ? (
              <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded-sm" />
            ) : (
              <div className="h-4 w-4 shrink-0 rounded-sm bg-zinc-200" />
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm text-zinc-800">{result.title}</div>
              <div className="truncate text-xs text-zinc-400">{result.url}</div>
            </div>

            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${
                result.type === 'tab'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {result.type === 'tab' ? 'Open tab' : 'History'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
