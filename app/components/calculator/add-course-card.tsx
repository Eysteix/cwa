import { useState } from 'react'
import type { Course } from '~/lib/calculator'

interface Props {
  onAdd: (course: Course & { name: string }) => void
  mode?: 'cwa' | 'marks' | 'gpa'
}

export function AddCourseCard({ onAdd, mode = 'cwa' }: Props) {
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('')
  const [score, setScore] = useState('')

  const isGpa = mode === 'gpa'
  const maxScore = isGpa ? 4.0 : 100

  function handleAdd() {
    const c = parseInt(credits)
    const s = parseFloat(score)
    if (!name.trim() || !c || isNaN(s) || s < 0 || s > maxScore) return
    onAdd({ name: name.trim(), credits: c, score: s })
    setName(''); setCredits(''); setScore('')
  }

  const canAdd = name.trim() && credits && score !== '' && parseFloat(score) >= 0 && parseFloat(score) <= maxScore

  const inputStyle = { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '10px 12px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--ink-2)', display: 'block', marginBottom: 5 }
  const hintStyle = { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)', marginTop: 5, lineHeight: 1.5 }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', paddingBottom: 12, marginBottom: 14, borderBottom: '2px solid var(--orange)' }}>
        Step 2 — Add This Semester's Courses
      </div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-2)', marginBottom: 14, lineHeight: 1.55 }}>
        Add each course you're taking this semester. Your projected average updates instantly.
      </p>
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Course Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Java Programming" style={inputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Credits</label>
          <input type="number" value={credits} onChange={e => setCredits(e.target.value)} placeholder="3" min={1} max={10} style={inputStyle} />
          <p style={hintStyle}>Credit hours for this course — check your timetable.</p>
        </div>
        <div>
          <label style={labelStyle}>{isGpa ? 'Grade Point (0.0–4.0)' : 'Score (0–100)'}</label>
          <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder={isGpa ? '3.5' : '85'} min={0} max={maxScore} step={0.01} style={inputStyle} />
          <p style={hintStyle}>{isGpa ? 'Grade point for this course — A=4.0, B+=3.5, B=3.0, etc.' : 'Your current or expected score out of 100.'}</p>
        </div>
      </div>
      <button onClick={handleAdd} disabled={!canAdd} style={{ fontFamily: 'var(--font-heading)', width: '100%', padding: 11, background: canAdd ? 'var(--ink)' : 'var(--ink-4)', color: canAdd ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
        Add Course
      </button>
    </div>
  )
}
