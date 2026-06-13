# Tab Wiz

A keyboard-first Chrome extension that replaces the new tab page with a visual tab organiser. Open tabs are automatically grouped into user-defined categories based on URL patterns.

## What it does

- `Cmd+T` (macOS) / `Ctrl+T` (Windows/Linux) opens Tab Wiz as your new tab page
- Tabs are grouped into columns by category — e.g. Intranet, Tools, Google Workspace
- `Tab` from the address bar focuses the search input
- Typing filters open tabs and searches browser history in real time
- Arrow keys + Enter navigate results; Escape clears the search
- Right-click any tab card to reveal a close button
- Categories and URL patterns are fully customisable in Settings

## Prerequisites

- Node.js ≥ 20 (`nvm use` if you have nvm)
- Google Chrome

## Getting started

```bash
npm install
npm run build
```

Then load the extension in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked** and select the `dist/` folder
4. Open a new tab — Tab Wiz replaces it

Chrome will prompt you to accept the `history` permission the first time.

## Development

```bash
npm run dev      # Vite watch mode — rebuilds on every save
npm run type-check  # TypeScript check without building
```

There is no hot module reload for extensions. After each rebuild, go to `chrome://extensions` and click the reload icon on the Tab Wiz card, then open a new tab to see changes.

## Customising categories

The default categories (Intranet, Tools, Office 365, Google Workspace, External Web) are examples — replace them with whatever makes sense for your workflow.

Open Settings from the footer of the new tab page. Each category has:
- A name and colour
- A list of URL glob patterns (e.g. `*github.com/*`, `*.corp.internal/*`)
- Categories are matched top-to-bottom; first match wins

Changes save automatically to your Chrome profile and sync across devices if Chrome Sync is enabled.

## Project structure

```
public/
  manifest.json       Chrome extension manifest (MV3)
  icons/              Extension icons
src/
  background/         Service worker — handles keyboard shortcut
  newtab/             New tab override page (main UI)
  settings/           Options page (category editor)
  components/         Shared React components
  hooks/              useStore (Zustand), useSearch
  lib/
    rules.ts          Category type + default examples
    categoriser.ts    URL glob matching logic
    storage.ts        chrome.storage.sync helpers
```

## Tech stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · Zustand 5 · Chrome MV3
