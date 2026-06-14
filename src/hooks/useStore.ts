import { create } from 'zustand'
import type { Category } from '../lib/rules'
import type { GroupedTabs } from '../lib/categoriser'
import { groupTabsByCategory } from '../lib/categoriser'
import { loadCategories, saveCategories } from '../lib/storage'

interface Store {
  categories: Category[]
  allTabs: chrome.tabs.Tab[]
  groupedTabs: GroupedTabs
  loading: boolean

  init: () => Promise<void>
  syncFromStorage: () => Promise<void>
  setCategories: (categories: Category[]) => Promise<void>
  addPatternToCategory: (categoryId: string, pattern: string) => Promise<void>
  refreshTabs: () => Promise<void>
  closeTab: (tabId: number) => Promise<void>
}

export const useStore = create<Store>((set, get) => {
  return {
    categories: [],
    allTabs: [],
    groupedTabs: new Map(),
    loading: true,

    init: async () => {
      const categories = await loadCategories()
      const tabs = await chrome.tabs.query({})
      set({
        categories,
        allTabs: tabs,
        groupedTabs: groupTabsByCategory(tabs, categories),
        loading: false,
      })
    },

    syncFromStorage: async () => {
      const categories = await loadCategories()
      const tabs = await chrome.tabs.query({})
      set({
        categories,
        allTabs: tabs,
        groupedTabs: groupTabsByCategory(tabs, categories),
      })
    },

    setCategories: async (categories) => {
      await saveCategories(categories)
      const tabs = await chrome.tabs.query({})
      set({ categories, allTabs: tabs, groupedTabs: groupTabsByCategory(tabs, categories) })
    },

    addPatternToCategory: async (categoryId, pattern) => {
      const { categories, setCategories } = get()
      const updated = categories.map((c) => {
        if (c.id !== categoryId || c.patterns.includes(pattern)) return c
        return { ...c, patterns: [...c.patterns, pattern] }
      })
      await setCategories(updated)
    },

    refreshTabs: async () => {
      const { categories } = get()
      const tabs = await chrome.tabs.query({})
      set({ allTabs: tabs, groupedTabs: groupTabsByCategory(tabs, categories) })
    },

    closeTab: async (tabId) => {
      await chrome.tabs.remove(tabId)
      const { categories } = get()
      const tabs = await chrome.tabs.query({})
      set({ allTabs: tabs, groupedTabs: groupTabsByCategory(tabs, categories) })
    },
  }
})
