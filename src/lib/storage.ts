import type { Category } from './rules'
import { DEFAULT_CATEGORIES } from './rules'

const STORAGE_KEY = 'categories'

export async function loadCategories(): Promise<Category[]> {
  const result = await chrome.storage.sync.get(STORAGE_KEY)
  return (result[STORAGE_KEY] as Category[] | undefined) ?? DEFAULT_CATEGORIES
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: categories })
}
