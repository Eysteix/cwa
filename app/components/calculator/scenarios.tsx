import type { Scenario } from '~/lib/calculator'

interface Props {
  scenarios: Scenario[]
  mode?: 'cwa' | 'marks' | 'gpa'
}

export function Scenarios({ scenarios, mode = 'cwa' }: Props) {
  if (scenarios.length === 0) return null
  const isGpa = mode === 'gpa'
  const ceiling = isGpa ? 4.0 : 100
  const label = isGpa ? 'Avg needed to boost GPA by...' : 'Avg needed to boost CWA by...'
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {scenarios.map(({ pct, requiredAvg }) => (
          <div key={pct} style={{ background: 'var(--bg)', borderRadius: 'var(--r)', padding: '12px 6px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)', textTransform: 'uppercase' }}>+{pct}%</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 800, color: requiredAvg > ceiling ? '#ef4444' : 'var(--orange)', margin: '5px 0 2px', fontVariantNumeric: 'tabular-nums' }}>
              {requiredAvg > ceiling ? `>${ceiling}` : requiredAvg < 0 ? 'N/A' : requiredAvg.toFixed(2)}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--ink-3)' }}>avg needed</div>
          </div>
        ))}
      </div>
    </div>
  )
}
