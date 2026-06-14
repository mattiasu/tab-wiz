import { useState } from 'react'
import { useStore } from '../hooks/useStore'

interface Props {
  tab: chrome.tabs.Tab
  onAssignToCategory: (tab: chrome.tabs.Tab) => void
}

function getFaviconUrl(tab: chrome.tabs.Tab): string | null {
  if (tab.favIconUrl && !tab.favIconUrl.startsWith('chrome://')) {
    return tab.favIconUrl
  }
  try {
    const url = new URL(tab.url ?? '')
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
  } catch {
    return null
  }
}

export default function TabCard({ tab, onAssignToCategory }: Props) {
  const { closeTab } = useStore()
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null)
  const favicon = getFaviconUrl(tab)

  function handleClick() {
    if (tab.id !== undefined) {
      chrome.tabs.update(tab.id, { active: true })
      if (tab.windowId !== undefined) {
        chrome.windows.update(tab.windowId, { focused: true })
      }
    }
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault()
    setMenuPos({ x: e.clientX, y: e.clientY })
  }

  function closeMenu() {
    setMenuPos(null)
  }

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        className="flex w-full items-center gap-2 rounded-md bg-white px-2.5 py-2 ring-1 ring-zinc-100 transition-all hover:bg-zinc-50 hover:ring-zinc-200"
      >
        <button
          onClick={handleClick}
          className="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none"
        >
          {favicon
            ? <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded-sm" />
            : <div className="h-4 w-4 shrink-0 rounded-sm bg-zinc-200" />
          }
          <span className="truncate text-sm text-zinc-700">{tab.title ?? tab.url}</span>
        </button>
      </div>

      {menuPos && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeMenu} />
          <div
            className="fixed z-20 min-w-44 overflow-hidden rounded-lg bg-white py-1 shadow-lg ring-1 ring-zinc-200"
            style={{ left: menuPos.x, top: menuPos.y }}
          >
            <button
              onClick={() => { closeMenu(); onAssignToCategory(tab) }}
              className="flex w-full items-center px-3 py-1.5 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Assign to category…
            </button>
            <div className="my-1 border-t border-zinc-100" />
            <button
              onClick={() => { closeMenu(); if (tab.id !== undefined) closeTab(tab.id) }}
              className="flex w-full items-center px-3 py-1.5 text-left text-sm text-red-500 hover:bg-red-50"
            >
              Close tab
            </button>
          </div>
        </>
      )}
    </>
  )
}
