import { useState } from 'react'
import { useLoaderData } from 'react-router'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'
import { OnboardingWizard } from '~/components/calculator/onboarding-wizard'
import { AcademicStatusCard } from '~/components/calculator/academic-status-card'
import { AddCourseCard } from '~/components/calculator/add-course-card'
import { CoursesList } from '~/components/calculator/courses-list'
import { Results } from '~/components/calculator/results'
import { Scenarios } from '~/components/calculator/scenarios'
import { TargetSheet } from '~/components/calculator/target-sheet'
import { storage } from '~/lib/storage'
import { calcResults, calcScenarios } from '~/lib/calculator'
import type { Route } from './+types/home'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'CWA Calculator' }]
}

export async function loader(_: Route.LoaderArgs) {
  const content = getContent()
  return { content, user: null }
}

interface StoredCourse {
  id: string
  name: string
  credits: number
  score: number
}

export default function HomePage() {
  const { content } = useLoaderData<typeof loader>()
  const [status, setStatus] = useState(() => storage.getStatus())
  const [courses, setCourses] = useState<StoredCourse[]>(() =>
    storage.getCourses().map((c, i) => ({ ...c, id: String(i), name: (c as { name?: string }).name ?? '' }))
  )
  const [onboarding, setOnboarding] = useState(() => storage.getOnboarding())
  const [targetOpen, setTargetOpen] = useState(false)

  const showOnboarding = !onboarding?.complete
  const results = status ? calcResults({ totalMarks: status.totalMarks, totalCredits: status.totalCredits }, courses) : null
  const scenarios = status && courses.length > 0 ? calcScenarios({ totalMarks: status.totalMarks, totalCredits: status.totalCredits }, courses) : []
  const semesterCredits = courses.reduce((s, c) => s + c.credits, 0)

  function handleSaveStatus(s: NonNullable<typeof status>) {
    setStatus(s)
    storage.setStatus(s)
  }

  function handleAddCourse(course: { name: string; credits: number; score: number }) {
    const newCourse = { ...course, id: String(Date.now()) }
    const updated = [...courses, newCourse]
    setCourses(updated)
    storage.setCourses(updated)
  }

  function handleDeleteCourse(id: string) {
    const updated = courses.filter(c => c.id !== id)
    setCourses(updated)
    storage.setCourses(updated)
  }

  function handleUpdateScore(id: string, score: number) {
    const updated = courses.map(c => c.id === id ? { ...c, score } : c)
    setCourses(updated)
    storage.setCourses(updated)
  }

  function handleOnboardingComplete(data: NonNullable<typeof onboarding>) {
    setOnboarding(data)
    storage.setOnboarding(data)
  }

  function handleOnboardingSkip() {
    const skipped = { university: '', programme: '', yearOfStudy: null, semester: null, complete: true }
    setOnboarding(skipped)
    storage.setOnboarding(skipped)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {!status && (
        <div style={{ background: 'var(--orange-dim)', borderBottom: '1px solid var(--orange-border)', padding: '7px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 12, color: '#9a3412' }}>
          Sign in to save your progress across devices.{' '}
          <a href="/auth/sign-up" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>Create a free account →</a>
        </div>
      )}

      <main style={{ flex: 1, maxWidth: 1000, margin: '0 auto', padding: '28px 24px', width: '100%', display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
        <div>
          {showOnboarding && (
            <OnboardingWizard
              yearOptions={content.onboarding.yearOptions}
              semesterOptions={content.onboarding.semesterOptions}
              onComplete={handleOnboardingComplete}
              onSkip={handleOnboardingSkip}
            />
          )}
          <AcademicStatusCard initial={status} onSave={handleSaveStatus} />
          {status && <AddCourseCard onAdd={handleAddCourse} />}
        </div>

        <div>
          {status && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
                {[
                  { val: status.cwa.toFixed(2), lbl: 'CWA', hi: true },
                  { val: String(status.totalCredits), lbl: 'Credits' },
                  { val: status.totalMarks.toLocaleString(), lbl: 'Marks' },
                  { val: String(courses.length), lbl: 'Courses' },
                ].map(({ val, lbl, hi }) => (
                  <div key={lbl} style={{ background: hi ? 'var(--ink)' : 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)', padding: '12px 8px', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: hi ? 'var(--orange)' : 'var(--ink)', lineHeight: 1 }}>{val}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.06em', color: hi ? '#71717a' : 'var(--ink-3)', marginTop: 5 }}>{lbl}</div>
                  </div>
                ))}
              </div>
              <CoursesList courses={courses} onDelete={handleDeleteCourse} onUpdateScore={handleUpdateScore} onOpenTarget={() => setTargetOpen(true)} />
              {results && <Results results={results} />}
              {scenarios.length > 0 && <Scenarios scenarios={scenarios} />}
            </>
          )}
        </div>
      </main>

      <Footer site={content.site} footerLinks={content.footerLinks} />

      {status && (
        <TargetSheet
          open={targetOpen}
          onClose={() => setTargetOpen(false)}
          status={{ totalMarks: status.totalMarks, totalCredits: status.totalCredits }}
          semesterCredits={semesterCredits}
          quickTargets={content.quickTargets}
        />
      )}
    </div>
  )
}
