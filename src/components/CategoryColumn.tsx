import type { Category } from '../lib/rules'
import TabCard from './TabCard'

interface Props {
  category: Category
  tabs: chrome.tabs.Tab[]
  onAssignToCategory: (tab: chrome.tabs.Tab) => void
}

export default function CategoryColumn({ category, tabs, onAssignToCategory }: Props) {
  return (
    <div className="flex w-64 shrink-0 flex-col gap-2">
      <div
        className="flex items-center gap-2 rounded-md px-2 py-1.5"
        style={{ backgroundColor: category.color + '18' }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-sm font-medium text-zinc-800">{category.name}</span>
        <span className="ml-auto text-xs text-zinc-400">{tabs.length}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tabs.map((tab) => (
          <TabCard key={tab.id} tab={tab} onAssignToCategory={onAssignToCategory} />
        ))}
      </div>
    </div>
  )
}
