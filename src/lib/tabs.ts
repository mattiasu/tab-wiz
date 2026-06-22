export async function switchToTab(tabId: number, windowId?: number): Promise<void> {
  const [current] = await chrome.tabs.query({ active: true, currentWindow: true })
  await chrome.tabs.update(tabId, { active: true })
  if (windowId !== undefined) await chrome.windows.update(windowId, { focused: true })
  if (current?.id && current.id !== tabId) await chrome.tabs.remove(current.id)
}
