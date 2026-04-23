import type { Course } from '~/lib/calculator'

interface StoredCourse extends Course {
  id: string
  name: string
}

interface Props {
  courses: StoredCourse[]
  onDelete: (id: string) => void
  onUpdateScore: (id: string, score: number) => void
  onOpenTarget: () => void
  onArchive?: () => void
}

export function CoursesList({ courses, onDelete, onUpdateScore, onOpenTarget, onArchive }: Props) {
  if (courses.length === 0) return null

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', paddingBottom: 12, marginBottom: 4, borderBottom: '2px solid var(--orange)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span>This Semester</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
          {onArchive && (
            <button
              onClick={onArchive}
              style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', background: 'none', border: '1px solid var(--ink-4)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}
              aria-label="Save this semester's courses"
            >
              Save
            </button>
          )}
          <button onClick={onOpenTarget} style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--orange)', background: 'none', border: '1px solid var(--orange-border)', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>
            Target CWA
          </button>
        </div>
      </div>

      {courses.map(course => {
        const marks = (course.score * course.credits).toFixed(1)
        return (
          <div key={course.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderTop: '1px solid var(--bg)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700 }}>{course.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>{course.credits} cr · {marks} marks</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="number"
                defaultValue={course.score}
                min={0} max={100} step={0.01}
                onBlur={e => {
                  const v = parseFloat(e.target.value)
                  if (!isNaN(v) && v >= 0 && v <= 100) onUpdateScore(course.id, v)
                }}
                style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: 'var(--orange)', width: 64, background: 'var(--bg)', border: 'none', outline: 'none', padding: '4px 6px', borderRadius: 4, textAlign: 'center' }}
              />
              <button onClick={() => onDelete(course.id)} style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} aria-label={`Remove ${course.name}`}>
                ✕
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
