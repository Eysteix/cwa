import type { CalcResults } from '~/lib/calculator'

interface Props { results: CalcResults }

export function Results({ results }: Props) {
  const { newCWA, cwaDelta, semesterAverage, newTotalMarks, newTotalCredits } = results
  const tileStyle = { background: 'var(--surface)', borderRadius: 'var(--r)', padding: '14px 12px', textAlign: 'center' as const, border: '1px solid #ebebeb', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }
  const valStyle = (accent?: boolean) => ({ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: accent ? 'var(--orange)' : 'var(--ink-2)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' as const })
  const lblStyle = { fontFamily: 'var(--font-mono)', fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--ink-3)', marginTop: 5 }
  const sign = cwaDelta > 0 ? '+' : ''
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)', marginBottom: 10 }}>Projected Results</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={tileStyle}><div style={valStyle(true)}>{newCWA.toFixed(2)}</div><div style={lblStyle}>New CWA {sign}{cwaDelta.toFixed(2)}</div></div>
        <div style={tileStyle}><div style={valStyle()}>{semesterAverage.toFixed(2)}</div><div style={lblStyle}>Sem Average</div></div>
        <div style={tileStyle}><div style={valStyle()}>{newTotalMarks.toLocaleString()}</div><div style={lblStyle}>New Marks</div></div>
        <div style={tileStyle}><div style={valStyle()}>{newTotalCredits}</div><div style={lblStyle}>New Credits</div></div>
      </div>
    </div>
  )
}
