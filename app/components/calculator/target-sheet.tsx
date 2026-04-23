import { useState, useEffect } from 'react'
import { calcTargetAverage } from '~/lib/calculator'
import type { AcademicStatus } from '~/lib/calculator'

interface Props {
  open: boolean
  onClose: () => void
  status: AcademicStatus
  semesterCredits: number
  quickTargets: number[]
  mode?: 'cwa' | 'marks' | 'gpa'
}

export function TargetSheet({ open, onClose, status, semesterCredits, quickTargets, mode = 'cwa' }: Props) {
  const [target, setTarget] = useState('')
  const targetNum = parseFloat(target)
  const required = !isNaN(targetNum) && semesterCredits > 0 ? calcTargetAverage(status, semesterCredits, targetNum) : null

  useEffect(() => { if (!open) setTarget('') }, [open])

  if (!open) return null

  const isGpa = mode === 'gpa'
  const ceiling = isGpa ? 4.0 : 100
  const gpaQuickTargets = [2.5, 3.0, 3.5]
  const activeQuickTargets = isGpa ? gpaQuickTargets : quickTargets
  const inputStyle = { fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '11px 14px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }
  const title = isGpa ? 'Target GPA Calculator' : 'Target CWA Calculator'
  const inputLabel = isGpa ? 'Enter Target GPA' : 'Enter Target CWA'
  const placeholder = isGpa ? 'e.g. 3.5' : 'e.g. 80'

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderRadius: '16px 16px 0 0', padding: 24, zIndex: 201, maxWidth: 500, margin: '0 auto', boxShadow: 'var(--sh-lg)' }}>
        <div style={{ width: 40, height: 4, background: 'var(--ink-4)', borderRadius: 2, margin: '0 auto 20px' }} />
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800, marginBottom: 16 }}>{title}</div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>{inputLabel}</label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder={placeholder} min={0} max={ceiling} step={isGpa ? 0.01 : 1} style={inputStyle} />
        </div>
        {required !== null && (
          <div style={{ background: 'var(--orange-dim)', border: '1px solid var(--orange-border)', borderRadius: 4, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Required avg</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 800, color: required > ceiling ? '#ef4444' : 'var(--orange)' }}>
              {required > ceiling ? `>${ceiling}` : required < 0 ? 'N/A' : required.toFixed(2)}
            </span>
          </div>
        )}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Quick targets</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {activeQuickTargets.map(t => (
              <button key={t} onClick={() => setTarget(String(t))} style={{ fontFamily: 'var(--font-body)', flex: 1, padding: '9px 0', border: '1px solid var(--ink-4)', borderRadius: 4, background: parseFloat(target) === t ? 'var(--ink)' : 'white', color: parseFloat(target) === t ? 'white' : 'var(--ink-2)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
