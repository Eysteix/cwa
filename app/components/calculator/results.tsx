import type { CalcResults } from '~/lib/calculator'

interface Props {
  results: CalcResults
  mode?: 'cwa' | 'marks' | 'gpa'
  freshStart?: boolean
}

export function Results({ results, mode = 'cwa', freshStart = false }: Props) {
  const { newCWA, cwaDelta, semesterAverage, newTotalMarks, newTotalCredits } = results
  const isGpa = mode === 'gpa'

  const tileStyle = { background: 'var(--surface)', borderRadius: 'var(--r)', padding: '14px 12px', textAlign: 'center' as const, border: '1px solid #ebebeb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }
  const valStyle = (accent?: boolean) => ({ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: accent ? 'var(--orange)' : 'var(--ink-2)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' as const })
  const lblStyle = { fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--ink-3)', marginTop: 6 }

  const sign = cwaDelta > 0 ? '+' : ''
  const avgLabel = freshStart ? (isGpa ? 'Your CGPA' : 'Your CWA') : (isGpa ? 'New CGPA' : 'New CWA')
  const semLabel = isGpa ? 'Sem CGPA' : 'Sem Average'
  const marksLabel = isGpa ? 'Grade Points' : freshStart ? 'Total Marks' : 'New Marks'
  const marksVal = isGpa ? newTotalMarks.toFixed(2) : newTotalMarks.toLocaleString()
  const deltaStr = freshStart ? '' : ` ${sign}${cwaDelta.toFixed(2)}`

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', marginBottom: 10 }}>Step 3 — Projected Results</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={tileStyle}><div style={valStyle(true)}>{newCWA.toFixed(2)}</div><div style={lblStyle}>{avgLabel}{deltaStr}</div></div>
        <div style={tileStyle}><div style={valStyle()}>{semesterAverage.toFixed(2)}</div><div style={lblStyle}>{semLabel}</div></div>
        <div style={tileStyle}><div style={valStyle()}>{marksVal}</div><div style={lblStyle}>{marksLabel}</div></div>
        <div style={tileStyle}><div style={valStyle()}>{newTotalCredits}</div><div style={lblStyle}>Credits</div></div>
      </div>
    </div>
  )
}
