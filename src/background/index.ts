import { recordVisit } from '../lib/usage'

chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-tab-wiz') {
    chrome.tabs.create({})
  }
})

function isBrowserUrl(url: string): boolean {
  return url.startsWith('chrome://') || url.startsWith('chrome-extension://')
}

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const tab = await chrome.tabs.get(tabId)
    const url = tab.url ?? tab.pendingUrl ?? ''
    if (url && !isBrowserUrl(url)) await recordVisit(url)
  } catch {
    // tab may have closed before we could read it
  }
})

chrome.tabs.onUpdated.addListener(async (_tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return
  const url = tab.url ?? ''
  if (url && !isBrowserUrl(url)) await recordVisit(url)
})
