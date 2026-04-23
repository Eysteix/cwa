import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface SiteContent {
  site: { name: string; tagline: string }
  quickTargets: number[]
  footerLinks: string[]
  auth: { heading: string; body: string }
  onboarding: { yearOptions: string[]; semesterOptions: string[] }
}

export function parseContent(raw: string): SiteContent {
  const sections: Record<string, string[]> = {}
  let current = ''

  for (const line of raw.split('\n')) {
    const h2 = line.match(/^## (.+)/)
    if (h2) { current = h2[1].trim(); sections[current] = []; continue }
    if (current && line.trim() && !line.startsWith('#')) {
      sections[current].push(line.trim())
    }
  }

  const kv = (section: string) =>
    Object.fromEntries(
      (sections[section] ?? []).map(l => {
        const i = l.indexOf(':')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      })
    )

  const list = (section: string) =>
    (sections[section] ?? [])
      .filter(l => l.startsWith('- '))
      .map(l => l.slice(2).trim())

  const site = kv('site')
  const auth = kv('auth')
  const onboarding = kv('onboarding')

  return {
    site: { name: site.name ?? 'FirstTarget', tagline: site.tagline ?? '' },
    quickTargets: list('quick_targets').map(Number),
    footerLinks: list('footer_links'),
    auth: { heading: auth.heading ?? '', body: auth.body ?? '' },
    onboarding: {
      yearOptions: (onboarding.year_options ?? '').split(',').map(s => s.trim()).filter(Boolean),
      semesterOptions: (onboarding.semester_options ?? '').split(',').map(s => s.trim()).filter(Boolean),
    },
  }
}

let _cache: SiteContent | null = null

export function getContent(): SiteContent {
  if (_cache) return _cache
  const path = resolve(process.cwd(), 'CONTENT.md')
  const raw = readFileSync(path, 'utf-8')
  _cache = parseContent(raw)
  return _cache
}
