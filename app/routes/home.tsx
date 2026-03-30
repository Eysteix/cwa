import { useState, useEffect } from 'react'
import { useLoaderData, useFetcher } from 'react-router'
import { Header } from '~/components/header'
import { Footer } from '~/components/footer'
import { OnboardingWizard } from '~/components/calculator/onboarding-wizard'
import { AcademicStatusCard } from '~/components/calculator/academic-status-card'
import { AddCourseCard } from '~/components/calculator/add-course-card'
import { CoursesList } from '~/components/calculator/courses-list'
import { Results } from '~/components/calculator/results'
import { Scenarios } from '~/components/calculator/scenarios'
import { TargetSheet } from '~/components/calculator/target-sheet'
import { SemesterArchive } from '~/components/calculator/semester-archive'
import { storage } from '~/lib/storage'
import { calcResults, calcScenarios } from '~/lib/calculator'
import { getContent } from '~/lib/content'
import { auth } from '~/lib/auth'
import { db } from '~/lib/db'
import type { Route } from './+types/home'
import type { StoredStatus, OnboardingData, StoredSemester } from '~/lib/storage'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'CWA Calculator' }]
}

export async function loader({ request }: Route.LoaderArgs) {
  const content = getContent()
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session?.user) {
    return { content, user: null, academicStatus: null, courses: [] as DbCourse[], semesters: [] as DbSemester[] }
  }

  const userId = session.user.id
  const [academicStatus, courses, semesters] = await Promise.all([
    db.academicStatus.findUnique({ where: { userId } }),
    db.course.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    db.semester.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
  ])

  return { content, user: session.user, academicStatus, courses, semesters }
}

export async function action({ request }: Route.ActionArgs) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return { error: 'Unauthorized' }

  const userId = session.user.id
  const formData = await request.formData()
  const intent = formData.get('intent') as string

  if (intent === 'saveStatus') {
    const inputMode = formData.get('inputMode') as string
    const cwa = parseFloat(formData.get('cwa') as string)
    const totalMarks = parseFloat(formData.get('totalMarks') as string)
    const totalCredits = parseInt(formData.get('totalCredits') as string)
    await db.academicStatus.upsert({
      where: { userId },
      create: { userId, inputMode, cwa, totalMarks, totalCredits },
      update: { inputMode, cwa, totalMarks, totalCredits },
    })
    return { ok: true }
  }

  if (intent === 'addCourse') {
    const name = formData.get('name') as string
    const credits = parseInt(formData.get('credits') as string)
    const score = parseFloat(formData.get('score') as string)
    const course = await db.course.create({ data: { userId, name, credits, score } })
    return { ok: true, course }
  }

  if (intent === 'deleteCourse') {
    const id = formData.get('id') as string
    await db.course.deleteMany({ where: { id, userId } })
    return { ok: true }
  }

  if (intent === 'updateScore') {
    const id = formData.get('id') as string
    const score = parseFloat(formData.get('score') as string)
    await db.course.updateMany({ where: { id, userId }, data: { score } })
    return { ok: true }
  }

  if (intent === 'saveOnboarding') {
    const university = formData.get('university') as string
    const programme = formData.get('programme') as string
    const yearOfStudy = formData.get('yearOfStudy') ? parseInt(formData.get('yearOfStudy') as string) : null
    const semester = formData.get('semester') ? parseInt(formData.get('semester') as string) : null
    await db.academicStatus.upsert({
      where: { userId },
      create: { userId, university, programme, yearOfStudy, semester, onboardingComplete: true, cwa: 0, totalMarks: 0, totalCredits: 0 },
      update: { university, programme, yearOfStudy, semester, onboardingComplete: true },
    })
    return { ok: true }
  }

  if (intent === 'archiveSemester') {
    const label = formData.get('label') as string
    const coursesJson = formData.get('courses') as string
    await db.semester.create({ data: { userId, label, courses: coursesJson } })
    return { ok: true }
  }

  if (intent === 'deleteSemester') {
    const id = formData.get('id') as string
    await db.semester.deleteMany({ where: { id, userId } })
    return { ok: true }
  }

  if (intent === 'replaceCoursesFromArchive') {
    const coursesJson = formData.get('courses') as string
    const cs = JSON.parse(coursesJson) as Array<{ name: string; credits: number; score: number }>
    await db.course.deleteMany({ where: { userId } })
    for (const c of cs) {
      await db.course.create({ data: { userId, name: c.name, credits: c.credits, score: c.score } })
    }
    return { ok: true }
  }

  if (intent === 'importGuest') {
    const statusJson = formData.get('status') as string | null
    const coursesJson = formData.get('courses') as string | null
    const onboardingJson = formData.get('onboarding') as string | null

    if (statusJson) {
      const s = JSON.parse(statusJson) as StoredStatus
      await db.academicStatus.upsert({
        where: { userId },
        create: { userId, inputMode: s.inputMode, cwa: s.cwa, totalMarks: s.totalMarks, totalCredits: s.totalCredits },
        update: { inputMode: s.inputMode, cwa: s.cwa, totalMarks: s.totalMarks, totalCredits: s.totalCredits },
      })
    }
    if (coursesJson) {
      const cs = JSON.parse(coursesJson) as Array<{ name: string; credits: number; score: number }>
      await db.course.deleteMany({ where: { userId } })
      for (const c of cs) {
        await db.course.create({ data: { userId, name: c.name ?? '', credits: c.credits, score: c.score } })
      }
    }
    if (onboardingJson) {
      const ob = JSON.parse(onboardingJson) as OnboardingData
      await db.academicStatus.upsert({
        where: { userId },
        create: { userId, university: ob.university, programme: ob.programme, yearOfStudy: ob.yearOfStudy, semester: ob.semester, onboardingComplete: true, cwa: 0, totalMarks: 0, totalCredits: 0 },
        update: { university: ob.university, programme: ob.programme, yearOfStudy: ob.yearOfStudy, semester: ob.semester, onboardingComplete: ob.complete },
      })
    }
    return { ok: true }
  }

  return { error: 'Unknown intent' }
}

interface DbCourse { id: string; name: string; credits: number; score: number }
interface DbSemester { id: string; label: string; courses: string; createdAt: Date | string }

interface StoredCourse {
  id: string
  name: string
  credits: number
  score: number
}

export default function HomePage() {
  const { content, user, academicStatus: dbStatus, courses: dbCourses, semesters: dbSemesters } = useLoaderData<typeof loader>()
  const isLoggedIn = !!user
  const fetcher = useFetcher()
  const [targetOpen, setTargetOpen] = useState(false)

  const [showMigration, setShowMigration] = useState(false)
  useEffect(() => {
    if (isLoggedIn && storage.hasAnyData()) setShowMigration(true)
  }, [isLoggedIn])

  // Guest-only local state
  const [guestStatus, setGuestStatus] = useState<StoredStatus | null>(() =>
    isLoggedIn ? null : storage.getStatus()
  )
  const [guestCourses, setGuestCourses] = useState<StoredCourse[]>(() =>
    isLoggedIn
      ? []
      : storage.getCourses().map((c, i) => ({ ...c, id: String(i), name: (c as { name?: string }).name ?? '' }))
  )
  const [guestOnboarding, setGuestOnboarding] = useState<OnboardingData | null>(() =>
    isLoggedIn ? null : storage.getOnboarding()
  )
  const [guestSemesters, setGuestSemesters] = useState<StoredSemester[]>(() =>
    isLoggedIn ? [] : storage.getSemesters()
  )

  // Unified views
  const status: StoredStatus | null = isLoggedIn
    ? dbStatus
      ? { inputMode: dbStatus.inputMode as 'cwa' | 'marks', cwa: dbStatus.cwa, totalMarks: dbStatus.totalMarks, totalCredits: dbStatus.totalCredits }
      : null
    : guestStatus

  const courses: StoredCourse[] = isLoggedIn
    ? (dbCourses as DbCourse[]).map(c => ({ id: c.id, name: c.name, credits: c.credits, score: c.score }))
    : guestCourses

  const onboarding: OnboardingData | null = isLoggedIn
    ? dbStatus
      ? {
          university: (dbStatus as { university?: string | null }).university ?? '',
          programme: (dbStatus as { programme?: string | null }).programme ?? '',
          yearOfStudy: (dbStatus as { yearOfStudy?: number | null }).yearOfStudy ?? null,
          semester: (dbStatus as { semester?: number | null }).semester ?? null,
          complete: (dbStatus as { onboardingComplete: boolean }).onboardingComplete,
        }
      : null
    : guestOnboarding

  const semesters: StoredSemester[] = isLoggedIn
    ? (dbSemesters as DbSemester[]).map(s => ({
        id: s.id,
        label: s.label,
        courses: JSON.parse(s.courses) as StoredSemester['courses'],
        createdAt: String(s.createdAt),
      }))
    : guestSemesters

  const showOnboarding = !onboarding?.complete
  const results = status ? calcResults({ totalMarks: status.totalMarks, totalCredits: status.totalCredits }, courses) : null
  const scenarios = status && courses.length > 0 ? calcScenarios({ totalMarks: status.totalMarks, totalCredits: status.totalCredits }, courses) : []
  const semesterCredits = courses.reduce((s, c) => s + c.credits, 0)

  // ── Mutations ────────────────────────────────────────────────────────────────

  function handleSaveStatus(s: StoredStatus) {
    if (isLoggedIn) {
      fetcher.submit(
        { intent: 'saveStatus', inputMode: s.inputMode, cwa: String(s.cwa), totalMarks: String(s.totalMarks), totalCredits: String(s.totalCredits) },
        { method: 'post' }
      )
    } else {
      setGuestStatus(s)
      storage.setStatus(s)
    }
  }

  function handleAddCourse(course: { name: string; credits: number; score: number }) {
    if (isLoggedIn) {
      fetcher.submit(
        { intent: 'addCourse', name: course.name, credits: String(course.credits), score: String(course.score) },
        { method: 'post' }
      )
    } else {
      const newCourse = { ...course, id: String(Date.now()) }
      const updated = [...guestCourses, newCourse]
      setGuestCourses(updated)
      storage.setCourses(updated)
    }
  }

  function handleDeleteCourse(id: string) {
    if (isLoggedIn) {
      fetcher.submit({ intent: 'deleteCourse', id }, { method: 'post' })
    } else {
      const updated = guestCourses.filter(c => c.id !== id)
      setGuestCourses(updated)
      storage.setCourses(updated)
    }
  }

  function handleUpdateScore(id: string, score: number) {
    if (isLoggedIn) {
      fetcher.submit({ intent: 'updateScore', id, score: String(score) }, { method: 'post' })
    } else {
      const updated = guestCourses.map(c => c.id === id ? { ...c, score } : c)
      setGuestCourses(updated)
      storage.setCourses(updated)
    }
  }

  function handleOnboardingComplete(data: OnboardingData) {
    if (isLoggedIn) {
      fetcher.submit(
        { intent: 'saveOnboarding', university: data.university, programme: data.programme, yearOfStudy: data.yearOfStudy != null ? String(data.yearOfStudy) : '', semester: data.semester != null ? String(data.semester) : '' },
        { method: 'post' }
      )
    } else {
      setGuestOnboarding(data)
      storage.setOnboarding(data)
    }
  }

  function handleOnboardingSkip() {
    const skipped: OnboardingData = { university: '', programme: '', yearOfStudy: null, semester: null, complete: true }
    if (isLoggedIn) {
      fetcher.submit({ intent: 'saveOnboarding', university: '', programme: '', yearOfStudy: '', semester: '' }, { method: 'post' })
    } else {
      setGuestOnboarding(skipped)
      storage.setOnboarding(skipped)
    }
  }

  function handleArchiveSemester(label: string) {
    const payload = courses.map(c => ({ name: c.name, credits: c.credits, score: c.score }))
    if (isLoggedIn) {
      fetcher.submit({ intent: 'archiveSemester', label, courses: JSON.stringify(payload) }, { method: 'post' })
    } else {
      const saved = storage.saveSemester(label, payload)
      setGuestSemesters(prev => [...prev, saved])
    }
  }

  function handleLoadSemester(semCourses: StoredSemester['courses']) {
    const loaded = semCourses.map((c, i) => ({ ...c, id: String(Date.now() + i) }))
    if (isLoggedIn) {
      // Replace DB courses: delete all then re-add (done client-side optimistically here;
      // real persistence happens on any subsequent mutation)
      fetcher.submit(
        {
          intent: 'replaceCoursesFromArchive',
          courses: JSON.stringify(semCourses),
        },
        { method: 'post' }
      )
    } else {
      setGuestCourses(loaded)
      storage.setCourses(loaded)
    }
  }

  function handleDeleteSemester(id: string) {
    if (isLoggedIn) {
      fetcher.submit({ intent: 'deleteSemester', id }, { method: 'post' })
    } else {
      storage.deleteSemester(id)
      setGuestSemesters(prev => prev.filter(s => s.id !== id))
    }
  }

  function handleImportGuest() {
    const statusData = storage.getStatus()
    const coursesData = storage.getCourses()
    const onboardingData = storage.getOnboarding()
    fetcher.submit(
      { intent: 'importGuest', status: statusData ? JSON.stringify(statusData) : '', courses: JSON.stringify(coursesData), onboarding: onboardingData ? JSON.stringify(onboardingData) : '' },
      { method: 'post' }
    )
    storage.clear()
    setShowMigration(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {showMigration && (
        <div role="alert" style={{ background: '#fff7ed', borderBottom: '1px solid #fed7aa', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: 'var(--font-body)', fontSize: 13, flexWrap: 'wrap' }}>
          <span style={{ color: '#9a3412' }}>You have unsaved guest data. Import it into your account?</span>
          <button
            onClick={handleImportGuest}
            style={{ background: 'var(--orange)', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            Import
          </button>
          <button
            onClick={() => { storage.clear(); setShowMigration(false) }}
            style={{ background: 'none', color: 'var(--ink-3)', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
            aria-label="Discard guest data"
          >
            Discard
          </button>
        </div>
      )}

      {!isLoggedIn && !status && (
        <div style={{ background: 'var(--orange-dim)', borderBottom: '1px solid var(--orange-border)', padding: '7px 24px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13, color: '#9a3412' }}>
          Sign in to save your progress across devices.{' '}
          <a href="/auth/sign-up" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>Create a free account →</a>
        </div>
      )}

      <main className="main-padding" style={{ flex: 1, maxWidth: 1000, margin: '0 auto', padding: '28px 24px', width: '100%' }}>
        <div className="main-grid">
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
            <SemesterArchive
              semesters={semesters}
              onLoad={handleLoadSemester}
              onDelete={handleDeleteSemester}
              onArchive={handleArchiveSemester}
              hasCurrentCourses={courses.length > 0}
            />
          </div>

          <div>
            {status && (
              <>
                <div className="stats-grid" role="region" aria-label="Academic summary">
                  {[
                    { val: status.cwa.toFixed(2), lbl: 'CWA', hi: true },
                    { val: String(status.totalCredits), lbl: 'Credits' },
                    { val: status.totalMarks.toLocaleString(), lbl: 'Marks' },
                    { val: String(courses.length), lbl: 'Courses' },
                  ].map(({ val, lbl, hi }) => (
                    <div key={lbl} style={{ background: hi ? 'var(--ink)' : 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-sm)', padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, color: hi ? 'var(--orange)' : 'var(--ink)', lineHeight: 1 }}>{val}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: hi ? '#71717a' : 'var(--ink-3)', marginTop: 5 }}>{lbl}</div>
                    </div>
                  ))}
                </div>
                <CoursesList
                  courses={courses}
                  onDelete={handleDeleteCourse}
                  onUpdateScore={handleUpdateScore}
                  onOpenTarget={() => setTargetOpen(true)}
                  onArchive={courses.length > 0 ? handleArchiveSemester.bind(null, `Semester ${semesters.length + 1}`) : undefined}
                />
                {results && <Results results={results} />}
                {scenarios.length > 0 && <Scenarios scenarios={scenarios} />}
              </>
            )}
          </div>
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
