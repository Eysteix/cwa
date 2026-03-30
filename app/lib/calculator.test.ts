import { describe, it, expect } from 'vitest'
import {
  calcCWA,
  calcResults,
  calcScenarios,
  calcTargetAverage,
} from './calculator'

describe('calcCWA', () => {
  it('divides total marks by total credits', () => {
    expect(calcCWA(2858, 38)).toBeCloseTo(75.21, 1)
  })
  it('returns 0 when credits are 0', () => {
    expect(calcCWA(100, 0)).toBe(0)
  })
})

describe('calcResults', () => {
  it('computes new CWA after adding semester courses', () => {
    const courses = [{ credits: 3, score: 85 }, { credits: 4, score: 78 }]
    const r = calcResults({ totalMarks: 2858, totalCredits: 38 }, courses)
    expect(r).not.toBeNull()
    expect(r!.semesterCredits).toBe(7)
    expect(r!.semesterMarks).toBeCloseTo(3 * 85 + 4 * 78)
    expect(r!.newTotalMarks).toBeCloseTo(2858 + 3 * 85 + 4 * 78)
    expect(r!.newTotalCredits).toBe(45)
    expect(r!.newCWA).toBeCloseTo(r!.newTotalMarks / 45, 4)
    expect(r!.semesterAverage).toBeCloseTo((3 * 85 + 4 * 78) / 7, 4)
  })
  it('returns null when no courses', () => {
    expect(calcResults({ totalMarks: 2858, totalCredits: 38 }, [])).toBeNull()
  })
})

describe('calcScenarios', () => {
  it('returns required averages for 1%, 3%, 5% CWA increase', () => {
    const status = { totalMarks: 2858, totalCredits: 38 }
    const courses = [{ credits: 3, score: 85 }, { credits: 4, score: 78 }]
    const s = calcScenarios(status, courses)
    expect(s).toHaveLength(3)
    expect(s[0].pct).toBe(1)
    expect(s[1].pct).toBe(3)
    expect(s[2].pct).toBe(5)
    s.forEach(sc => expect(isFinite(sc.requiredAvg)).toBe(true))
  })
})

describe('calcTargetAverage', () => {
  it('computes average needed to hit a target CWA', () => {
    const status = { totalMarks: 2858, totalCredits: 38 }
    const semCredits = 10
    const target = 80
    const avg = calcTargetAverage(status, semCredits, target)
    // (80 * 48 - 2858) / 10
    expect(avg).toBeCloseTo((80 * 48 - 2858) / 10, 4)
  })
})
