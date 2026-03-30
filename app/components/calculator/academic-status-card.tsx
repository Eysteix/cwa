import { useState } from 'react'
import { calcCWA } from '~/lib/calculator'
import type { StoredStatus } from '~/lib/storage'

interface Props {
  initial: StoredStatus | null
  onSave: (status: StoredStatus) => void
}

export function AcademicStatusCard({ initial, onSave }: Props) {
  const [mode, setMode] = useState<'cwa' | 'marks'>(initial?.inputMode ?? 'cwa')
  const [cwaInput, setCwaInput] = useState(initial?.inputMode === 'cwa' ? String(initial.cwa) : '')
  const [marksInput, setMarksInput] = useState(initial?.totalMarks ? String(initial.totalMarks) : '')
  const [creditsInput, setCreditsInput] = useState(initial?.totalCredits ? String(initial.totalCredits) : '')

  const credits = parseFloat(creditsInput) || 0
  const liveCWA = mode === 'cwa'
    ? parseFloat(cwaInput) || 0
    : calcCWA(parseFloat(marksInput) || 0, credits)

  function handleSave() {
    if (!credits) return
    const totalMarks = mode === 'cwa' ? liveCWA * credits : parseFloat(marksInput) || 0
    onSave({ inputMode: mode, cwa: liveCWA, totalMarks, totalCredits: credits })
  }

  const canSave = credits > 0 && liveCWA > 0

  const inputStyle = { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '10px 12px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 4 }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: 12, marginBottom: 14, borderBottom: '2px solid var(--orange)' }}>
        Academic Status
      </div>

      <div style={{ display: 'flex', gap: 2, background: 'var(--bg)', borderRadius: 4, padding: 3, marginBottom: 14 }}>
        {(['cwa', 'marks'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '7px 8px', fontSize: 11, fontFamily: 'var(--font-body)', fontWeight: 600, textAlign: 'center', borderRadius: 3, border: 'none', cursor: 'pointer', background: mode === m ? 'var(--surface)' : 'transparent', color: mode === m ? 'var(--ink)' : 'var(--ink-3)', boxShadow: mode === m ? 'var(--sh-sm)' : 'none' }}>
            {m === 'cwa' ? 'I know my CWA' : 'I have my marks'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        {mode === 'cwa' ? (
          <div>
            <label style={labelStyle}>Current CWA</label>
            <input type="number" value={cwaInput} onChange={e => setCwaInput(e.target.value)} placeholder="e.g. 75.40" style={inputStyle} />
          </div>
        ) : (
          <div>
            <label style={labelStyle}>Total Marks</label>
            <input type="number" value={marksInput} onChange={e => setMarksInput(e.target.value)} placeholder="e.g. 2858" style={inputStyle} />
          </div>
        )}
        <div>
          <label style={labelStyle}>Total Credits</label>
          <input type="number" value={creditsInput} onChange={e => setCreditsInput(e.target.value)} placeholder="e.g. 38" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--orange-dim)', padding: '11px 14px', borderRadius: 4, marginBottom: 12, boxShadow: 'inset 0 0 0 1px var(--orange-border)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9a3412' }}>Your CWA</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 800, color: 'var(--orange)' }}>
          {liveCWA > 0 ? liveCWA.toFixed(2) : '--'}
        </span>
      </div>

      <button onClick={handleSave} disabled={!canSave} style={{ fontFamily: 'var(--font-heading)', width: '100%', padding: 11, background: canSave ? 'var(--ink)' : 'var(--ink-4)', color: canSave ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: canSave ? 'pointer' : 'not-allowed' }}>
        Save Status
      </button>
    </div>
  )
}
