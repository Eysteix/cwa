import { useState } from 'react'
import type { OnboardingData } from '~/lib/storage'

interface Props {
  yearOptions: string[]
  semesterOptions: string[]
  onComplete: (data: OnboardingData) => void
  onSkip: () => void
}

export function OnboardingWizard({ yearOptions, semesterOptions, onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0)
  const [university, setUniversity] = useState('')
  const [programme, setProgramme] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState<number | null>(null)
  const [semester, setSemester] = useState<number | null>(null)

  const steps = ['University', 'Programme', 'Year of Study', 'Semester']
  const isLast = step === 3

  function handleNext() {
    if (isLast) {
      onComplete({ university, programme, yearOfStudy, semester, complete: true })
    } else {
      setStep(s => s + 1)
    }
  }

  const canContinue = [
    university.trim().length > 0,
    programme.trim().length > 0,
    yearOfStudy !== null,
    semester !== null,
  ][step]

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--r)', boxShadow: 'var(--sh-md)', padding: 20, marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--orange)', paddingBottom: 8 }}>
          Quick Setup — Step {step + 1} of {steps.length}
        </span>
        <button onClick={onSkip} style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer' }}>
          Skip
        </button>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {steps.map((_, i) => (
          <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < step ? 'var(--ink)' : i === step ? 'var(--orange)' : 'var(--ink-4)' }} />
        ))}
      </div>

      {/* Step content */}
      {step === 0 && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>Your University</label>
          <input
            autoFocus
            type="text"
            value={university}
            onChange={e => setUniversity(e.target.value)}
            placeholder="e.g. KNUST"
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '10px 12px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}
          />
        </div>
      )}

      {step === 1 && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 4 }}>Programme / Course</label>
          <input
            autoFocus
            type="text"
            value={programme}
            onChange={e => setProgramme(e.target.value)}
            placeholder="e.g. BSc Information Technology"
            style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '10px 12px', borderRadius: 4, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}
          />
        </div>
      )}

      {step === 2 && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 8 }}>Year of Study</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {yearOptions.map((opt, i) => (
              <button key={opt} onClick={() => setYearOfStudy(i + 1)} style={{ fontFamily: 'var(--font-body)', padding: '7px 14px', borderRadius: 4, border: '1px solid', borderColor: yearOfStudy === i + 1 ? 'var(--ink)' : 'var(--ink-4)', background: yearOfStudy === i + 1 ? 'var(--ink)' : 'white', color: yearOfStudy === i + 1 ? 'white' : 'var(--ink-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 8 }}>Semester</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {semesterOptions.map((opt, i) => (
              <button key={opt} onClick={() => setSemester(i + 1)} style={{ fontFamily: 'var(--font-body)', padding: '7px 14px', borderRadius: 4, border: '1px solid', borderColor: semester === i + 1 ? 'var(--ink)' : 'var(--ink-4)', background: semester === i + 1 ? 'var(--ink)' : 'white', color: semester === i + 1 ? 'white' : 'var(--ink-2)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!canContinue}
        style={{ fontFamily: 'var(--font-heading)', width: '100%', padding: 11, background: canContinue ? 'var(--ink)' : 'var(--ink-4)', color: canContinue ? 'white' : 'var(--ink-3)', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: canContinue ? 'pointer' : 'not-allowed' }}
      >
        {isLast ? 'Finish Setup' : 'Continue →'}
      </button>
    </div>
  )
}
