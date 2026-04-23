import { useState } from 'react'
import type { Course } from '~/lib/calculator'

interface Props {
  onAdd: (courses: Array<Course & { name: string }>) => void
  mode?: 'cwa' | 'marks' | 'gpa'
}

export function AddCourseCard({ onAdd, mode = 'cwa' }: Props) {
  const [courseCount, setCourseCount] = useState('')
  const [courseInputs, setCourseInputs] = useState<Array<{ name: string; credits: string; score: string }>>([])

  const isGpa = mode === 'gpa'
  const maxScore = isGpa ? 4.0 : 100

  function handleSetCourseCount() {
    const total = parseInt(courseCount)
    if (isNaN(total) || total < 1 || total > 15) return

    setCourseInputs((prev) =>
      Array.from({ length: total }, (_, i) => prev[i] ?? { name: '', credits: '', score: '' })
    )
  }

  function updateCourseInput(index: number, key: 'name' | 'credits' | 'score', value: string) {
    setCourseInputs((prev) =>
      prev.map((course, i) => (i === index ? { ...course, [key]: value } : course))
    )
  }

  const canSetCount = !isNaN(parseInt(courseCount)) && parseInt(courseCount) >= 1 && parseInt(courseCount) <= 15

  const parsedCourses = courseInputs.map((course) => {
    const credits = parseInt(course.credits)
    const score = parseFloat(course.score)
    return { name: course.name.trim(), credits, score }
  })

  const canAdd = parsedCourses.length > 0 && parsedCourses.every(
    (course) => course.name && !isNaN(course.credits) && course.credits > 0 && !isNaN(course.score) && course.score >= 0 && course.score <= maxScore
  )

  function handleAddAll() {
    if (!canAdd) return
    onAdd(parsedCourses)
    setCourseCount('')
    setCourseInputs([])
  }

  const inputStyle = { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '10px 12px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--ink-2)', display: 'block', marginBottom: 5 }
  const hintStyle = { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)', marginTop: 5, lineHeight: 1.5 }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', paddingBottom: 12, marginBottom: 14, borderBottom: '2px solid var(--orange)' }}>
        Step 2 — Add This Semester's Courses
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.55 }}>
        Start by entering how many courses you're taking, then fill them in and add all courses at once.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Number of Courses</label>
          <input type="number" value={courseCount} onChange={e => setCourseCount(e.target.value)} placeholder="e.g. 5" min={1} max={15} style={inputStyle} />
          <p style={hintStyle}>Enter between 1 and 15 courses.</p>
        </div>
        <button onClick={handleSetCourseCount} disabled={!canSetCount} style={{ fontFamily: 'var(--font-heading)', alignSelf: 'end', padding: '10px 14px', background: canSetCount ? 'var(--ink)' : 'var(--ink-4)', color: canSetCount ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: canSetCount ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
          Set Courses
        </button>
      </div>

      {courseInputs.map((course, index) => (
        <div key={index} style={{ borderTop: '1px solid var(--bg)', paddingTop: 12, marginTop: 12 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--ink-2)' }}>
            Course {index + 1}
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>Course Name</label>
            <input type="text" value={course.name} onChange={e => updateCourseInput(index, 'name', e.target.value)} placeholder="e.g. Java Programming" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Credits</label>
              <input type="number" value={course.credits} onChange={e => updateCourseInput(index, 'credits', e.target.value)} placeholder="3" min={1} max={10} style={inputStyle} />
              <p style={hintStyle}>Credit hours for this course — check your timetable.</p>
            </div>
            <div>
              <label style={labelStyle}>{isGpa ? 'Grade Point (0.0–4.0)' : 'Score (0–100)'}</label>
              <input type="number" value={course.score} onChange={e => updateCourseInput(index, 'score', e.target.value)} placeholder={isGpa ? '3.5' : '85'} min={0} max={maxScore} step={0.01} style={inputStyle} />
              <p style={hintStyle}>{isGpa ? 'Grade point for this course — A=4.0, B+=3.5, B=3.0, etc.' : 'Your current or expected score out of 100.'}</p>
            </div>
          </div>
        </div>
      ))}

      <button onClick={handleAddAll} disabled={!canAdd} style={{ fontFamily: 'var(--font-heading)', width: '100%', padding: 11, marginTop: courseInputs.length > 0 ? 14 : 0, background: canAdd ? 'var(--ink)' : 'var(--ink-4)', color: canAdd ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
        Add All Courses
      </button>
    </div>
  )
}
