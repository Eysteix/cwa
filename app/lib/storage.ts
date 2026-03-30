import type { Course } from './calculator'

export interface OnboardingData {
  university: string
  programme: string
  yearOfStudy: number | null
  semester: number | null
  complete: boolean
}

export interface StoredStatus {
  inputMode: 'cwa' | 'marks'
  cwa: number
  totalMarks: number
  totalCredits: number
}

const KEYS = {
  status: 'cwa_status',
  courses: 'cwa_courses',
  onboarding: 'cwa_onboarding',
} as const

function isBrowser() {
  return typeof window !== 'undefined'
}

export const storage = {
  getStatus(): StoredStatus | null {
    if (!isBrowser()) return null
    try {
      const raw = localStorage.getItem(KEYS.status)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  setStatus(s: StoredStatus): void {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.status, JSON.stringify(s))
  },
  getCourses(): Course[] {
    if (!isBrowser()) return []
    try {
      const raw = localStorage.getItem(KEYS.courses)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  },
  setCourses(courses: Course[]): void {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.courses, JSON.stringify(courses))
  },
  getOnboarding(): OnboardingData | null {
    if (!isBrowser()) return null
    try {
      const raw = localStorage.getItem(KEYS.onboarding)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  },
  setOnboarding(data: OnboardingData): void {
    if (!isBrowser()) return
    localStorage.setItem(KEYS.onboarding, JSON.stringify(data))
  },
  clear(): void {
    if (!isBrowser()) return
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  },
  hasAnyData(): boolean {
    if (!isBrowser()) return false
    return !!localStorage.getItem(KEYS.status)
  },
}
