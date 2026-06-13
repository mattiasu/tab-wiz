import { useStore } from '../hooks/useStore'

interface Props {
  tab: chrome.tabs.Tab
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

export default function TabCard({ tab }: Props) {
  const { pendingCloseTabId, setPendingCloseTabId, closeTab } = useStore()
  const favicon = getFaviconUrl(tab)
  const isPendingClose = pendingCloseTabId === tab.id

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
    if (tab.id !== undefined) setPendingCloseTabId(tab.id)
  }

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation()
    if (tab.id !== undefined) closeTab(tab.id)
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`flex w-full items-center gap-2 rounded-md bg-white px-2.5 py-2 ring-1 transition-all ${
        isPendingClose
          ? 'ring-red-300 bg-red-50'
          : 'ring-zinc-100 hover:bg-zinc-50 hover:ring-zinc-200'
      }`}
    >
      <button
        onClick={handleClick}
        className="flex min-w-0 flex-1 items-center gap-2 text-left focus:outline-none"
      >
        {favicon ? (
          <img src={favicon} alt="" className="h-4 w-4 shrink-0 rounded-sm" />
        ) : (
          <div className="h-4 w-4 shrink-0 rounded-sm bg-zinc-200" />
        )}
        <span className={`truncate text-sm ${isPendingClose ? 'text-red-700' : 'text-zinc-700'}`}>
          {tab.title ?? tab.url}
        </span>
      </button>

      {isPendingClose && (
        <button
          onClick={handleClose}
          className="shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold text-red-500 ring-1 ring-red-300 hover:bg-red-500 hover:text-white transition-colors"
        >
          Close tab
        </button>
      )}
    </div>
  )
}
