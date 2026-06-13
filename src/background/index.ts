chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-tab-wiz') {
    chrome.tabs.create({})
  }
})
