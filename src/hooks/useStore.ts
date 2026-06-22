import { create } from 'zustand'
import type { Category } from '../lib/rules'
import type { GroupedTabs } from '../lib/categoriser'
import { groupTabsByCategory } from '../lib/categoriser'
import { loadCategories, saveCategories } from '../lib/storage'
import type { UsageMap } from '../lib/usage'
import { loadUsage } from '../lib/usage'

interface Store {
  categories: Category[]
  allTabs: chrome.tabs.Tab[]
  groupedTabs: GroupedTabs
  usageMap: UsageMap
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
    usageMap: {},
    loading: true,

    init: async () => {
      const [categories, tabs, usageMap] = await Promise.all([
        loadCategories(),
        chrome.tabs.query({}),
        loadUsage(),
      ])
      set({
        categories,
        allTabs: tabs,
        usageMap,
        groupedTabs: groupTabsByCategory(tabs, categories, usageMap),
        loading: false,
      })
    },

    syncFromStorage: async () => {
      const [categories, tabs, usageMap] = await Promise.all([
        loadCategories(),
        chrome.tabs.query({}),
        loadUsage(),
      ])
      set({
        categories,
        allTabs: tabs,
        usageMap,
        groupedTabs: groupTabsByCategory(tabs, categories, usageMap),
      })
    },

    setCategories: async (categories) => {
      await saveCategories(categories)
      const { usageMap } = get()
      const tabs = await chrome.tabs.query({})
      set({ categories, allTabs: tabs, groupedTabs: groupTabsByCategory(tabs, categories, usageMap) })
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
      const { categories, usageMap } = get()
      const tabs = await chrome.tabs.query({})
      set({ allTabs: tabs, groupedTabs: groupTabsByCategory(tabs, categories, usageMap) })
    },

    closeTab: async (tabId) => {
      await chrome.tabs.remove(tabId)
      const { categories, usageMap } = get()
      const tabs = await chrome.tabs.query({})
      set({ allTabs: tabs, groupedTabs: groupTabsByCategory(tabs, categories, usageMap) })
    },
  }
})
