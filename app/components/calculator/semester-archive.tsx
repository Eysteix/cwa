import { useState } from 'react'
import { calcCWA } from '~/lib/calculator'
import type { StoredSemester } from '~/lib/storage'

interface Props {
  semesters: StoredSemester[]
  onLoad: (courses: StoredSemester['courses']) => void
  onDelete: (id: string) => void
  onArchive: (label: string) => void
  hasCurrentCourses: boolean
}

export function SemesterArchive({ semesters, onLoad, onDelete, onArchive, hasCurrentCourses }: Props) {
  const [archiving, setArchiving] = useState(false)
  const [label, setLabel] = useState('')

  function handleArchive() {
    const trimmed = label.trim()
    if (!trimmed) return
    onArchive(trimmed)
    setLabel('')
    setArchiving(false)
  }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 12, marginBottom: 14, borderBottom: '2px solid var(--orange)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Semester History</span>
        {hasCurrentCourses && !archiving && (
          <button
            onClick={() => { setArchiving(true); setLabel(`Semester ${semesters.length + 1}`) }}
            style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--orange)', background: 'none', border: '1px solid var(--orange-border)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}
            aria-label="Save current semester courses"
          >
            Save current
          </button>
        )}
      </div>

      {archiving && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          <input
            type="text"
            value={label}
            onChange={e => setLabel(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleArchive(); if (e.key === 'Escape') setArchiving(false) }}
            autoFocus
            placeholder="e.g. Year 1 Sem 1"
            aria-label="Semester name"
            style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 13, padding: '8px 10px', borderRadius: 4, border: 'none', background: 'var(--bg)', outline: 'none', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }}
          />
          <button
            onClick={handleArchive}
            disabled={!label.trim()}
            style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, padding: '8px 14px', background: label.trim() ? 'var(--ink)' : 'var(--ink-4)', color: label.trim() ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, cursor: label.trim() ? 'pointer' : 'not-allowed' }}
          >
            Save
          </button>
          <button
            onClick={() => setArchiving(false)}
            style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 6px' }}
            aria-label="Cancel saving"
          >
            ✕
          </button>
        </div>
      )}

      {semesters.length === 0 && !archiving && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center', padding: '12px 0', margin: 0 }}>
          No saved semesters yet.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {semesters.map(sem => {
          const totalMarks = sem.courses.reduce((s, c) => s + c.score * c.credits, 0)
          const totalCredits = sem.courses.reduce((s, c) => s + c.credits, 0)
          const cwa = totalCredits > 0 ? calcCWA(totalMarks, totalCredits) : 0

          return (
            <div
              key={sem.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg)', borderRadius: 4, padding: '10px 12px', gap: 8 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {sem.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', marginTop: 2 }}>
                  {sem.courses.length} course{sem.courses.length !== 1 ? 's' : ''} · CWA {cwa.toFixed(1)}
                </div>
              </div>
              <button
                onClick={() => onLoad(sem.courses)}
                style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--orange)', background: 'none', border: '1px solid var(--orange-border)', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', flexShrink: 0 }}
                aria-label={`Load ${sem.label} courses`}
              >
                Load
              </button>
              <button
                onClick={() => onDelete(sem.id)}
                style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}
                aria-label={`Delete ${sem.label}`}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
