import type { Category } from './rules'

function globToRegex(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`, 'i')
}

function urlMatchesPattern(url: string, pattern: string): boolean {
  try {
    const { hostname, pathname } = new URL(url)
    const target = hostname + pathname
    return globToRegex(pattern).test(target)
  } catch {
    return false
  }
}

export function categoriseTab(
  tab: chrome.tabs.Tab,
  categories: Category[],
): Category | null {
  const url = tab.url ?? tab.pendingUrl ?? ''
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
    return null
  }
  const sorted = [...categories].sort((a, b) => a.order - b.order)
  for (const category of sorted) {
    if (category.patterns.some((p) => urlMatchesPattern(url, p))) {
      return category
    }
  }
  return null
}

export function suggestPatterns(url: string): string[] {
  try {
    const { hostname, pathname } = new URL(url)
    const suggestions = [`*${hostname}/*`, `${hostname}/*`]
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length >= 1) {
      suggestions.push(`${hostname}/${segments[0]}/*`)
    }
    return suggestions
  } catch {
    return []
  }
}

export type GroupedTabs = Map<string, { category: Category; tabs: chrome.tabs.Tab[] }>

export function groupTabsByCategory(
  tabs: chrome.tabs.Tab[],
  categories: Category[],
): GroupedTabs {
  const groups: GroupedTabs = new Map()

  for (const category of categories) {
    groups.set(category.id, { category, tabs: [] })
  }

  for (const tab of tabs) {
    const category = categoriseTab(tab, categories)
    if (category) {
      groups.get(category.id)?.tabs.push(tab)
    }
  }

  return groups
}
