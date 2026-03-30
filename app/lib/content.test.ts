import { describe, it, expect } from 'vitest'
import { parseContent, type SiteContent } from './content'

const sample = `
# CWA Calculator — Content

## site
name: My CWA App
tagline: Track grades

## quick_targets
- 78
- 80

## footer_links
- About
- Help

## auth
heading: Study smarter
body: Some body text here.

## onboarding
year_options: Year 1, Year 2, Year 3
semester_options: Semester 1, Semester 2
`

describe('parseContent', () => {
  it('parses site name and tagline', () => {
    const c = parseContent(sample)
    expect(c.site.name).toBe('My CWA App')
    expect(c.site.tagline).toBe('Track grades')
  })

  it('parses quick targets as numbers', () => {
    const c = parseContent(sample)
    expect(c.quickTargets).toEqual([78, 80])
  })

  it('parses footer links', () => {
    const c = parseContent(sample)
    expect(c.footerLinks).toEqual(['About', 'Help'])
  })

  it('parses auth copy', () => {
    const c = parseContent(sample)
    expect(c.auth.heading).toBe('Study smarter')
    expect(c.auth.body).toBe('Some body text here.')
  })

  it('parses onboarding options', () => {
    const c = parseContent(sample)
    expect(c.onboarding.yearOptions).toEqual(['Year 1', 'Year 2', 'Year 3'])
    expect(c.onboarding.semesterOptions).toEqual(['Semester 1', 'Semester 2'])
  })
})
