import { useState } from 'react'
import type { Course } from '~/lib/calculator'

interface Props {
  onAdd: (course: Course & { name: string }) => void
}

export function AddCourseCard({ onAdd }: Props) {
  const [name, setName] = useState('')
  const [credits, setCredits] = useState('')
  const [score, setScore] = useState('')

  function handleAdd() {
    const c = parseInt(credits)
    const s = parseFloat(score)
    if (!name.trim() || !c || isNaN(s) || s < 0 || s > 100) return
    onAdd({ name: name.trim(), credits: c, score: s })
    setName(''); setCredits(''); setScore('')
  }

  const canAdd = name.trim() && credits && score !== '' && parseFloat(score) >= 0 && parseFloat(score) <= 100

  const inputStyle = { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '10px 12px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 4 }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 12, marginBottom: 14, borderBottom: '2px solid var(--orange)' }}>
        Add Course
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={labelStyle}>Course Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Java Programming" style={inputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Credits</label>
          <input type="number" value={credits} onChange={e => setCredits(e.target.value)} placeholder="3" min={1} max={10} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Score (0–100)</label>
          <input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="85" min={0} max={100} step={0.01} style={inputStyle} />
        </div>
      </div>
      <button onClick={handleAdd} disabled={!canAdd} style={{ fontFamily: 'var(--font-heading)', width: '100%', padding: 11, background: canAdd ? 'var(--ink)' : 'var(--ink-4)', color: canAdd ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
        Add Course
      </button>
    </div>
  )
}
