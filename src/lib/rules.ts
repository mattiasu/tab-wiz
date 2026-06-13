export interface Category {
  id: string
  name: string
  color: string
  patterns: string[]
  order: number
}

// These are example categories to get started — edit or replace them in Settings.
export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'intranet',
    name: 'Intranet',
    color: '#6366f1',
    patterns: ['*.local/*', '192.168.*', '10.*', '172.16.*'],
    order: 0,
  },
  {
    id: 'tools',
    name: 'Tools',
    color: '#f59e0b',
    patterns: [
      '*github.com/*',
      '*gitlab.com/*',
      '*notion.so/*',
      '*linear.app/*',
      '*figma.com/*',
      '*jira.*/*',
      '*confluence.*/*',
      '*vercel.com/*',
      '*netlify.com/*',
    ],
    order: 1,
  },
  {
    id: 'office365',
    name: 'Office 365',
    color: '#0ea5e9',
    patterns: [
      '*.office.com/*',
      '*.microsoft.com/*',
      'outlook.live.com/*',
      'teams.microsoft.com/*',
      '*.sharepoint.com/*',
      '*.onedrive.com/*',
    ],
    order: 2,
  },
  {
    id: 'google',
    name: 'Google Workspace',
    color: '#22c55e',
    patterns: [
      'mail.google.com/*',
      'docs.google.com/*',
      'drive.google.com/*',
      'calendar.google.com/*',
      'meet.google.com/*',
      'sheets.google.com/*',
      'slides.google.com/*',
    ],
    order: 3,
  },
  {
    id: 'external',
    name: 'External Web',
    color: '#94a3b8',
    patterns: ['*'],
    order: 4,
  },
]
