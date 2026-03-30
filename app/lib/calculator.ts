export interface Course {
  credits: number
  score: number
}

export interface AcademicStatus {
  totalMarks: number
  totalCredits: number
}

export interface CalcResults {
  semesterMarks: number
  semesterCredits: number
  semesterAverage: number
  newTotalMarks: number
  newTotalCredits: number
  newCWA: number
  cwaDelta: number
}

export interface Scenario {
  pct: number
  requiredAvg: number
}

export function calcCWA(totalMarks: number, totalCredits: number): number {
  if (totalCredits === 0) return 0
  return totalMarks / totalCredits
}

export function calcResults(
  status: AcademicStatus,
  courses: Course[]
): CalcResults | null {
  if (courses.length === 0) return null

  const semesterMarks = courses.reduce((s, c) => s + c.score * c.credits, 0)
  const semesterCredits = courses.reduce((s, c) => s + c.credits, 0)
  const semesterAverage = semesterMarks / semesterCredits
  const newTotalMarks = status.totalMarks + semesterMarks
  const newTotalCredits = status.totalCredits + semesterCredits
  const newCWA = newTotalMarks / newTotalCredits
  const cwaDelta = newCWA - calcCWA(status.totalMarks, status.totalCredits)

  return { semesterMarks, semesterCredits, semesterAverage, newTotalMarks, newTotalCredits, newCWA, cwaDelta }
}

export function calcScenarios(
  status: AcademicStatus,
  courses: Course[]
): Scenario[] {
  const semesterCredits = courses.reduce((s, c) => s + c.credits, 0)
  if (semesterCredits === 0) return []

  const currentCWA = calcCWA(status.totalMarks, status.totalCredits)

  return [1, 3, 5].map(pct => {
    const targetCWA = currentCWA * (1 + pct / 100)
    const requiredAvg = calcTargetAverage(status, semesterCredits, targetCWA)
    return { pct, requiredAvg }
  })
}

export function calcTargetAverage(
  status: AcademicStatus,
  semesterCredits: number,
  targetCWA: number
): number {
  if (semesterCredits === 0) return 0
  const targetTotalMarks = targetCWA * (status.totalCredits + semesterCredits)
  return (targetTotalMarks - status.totalMarks) / semesterCredits
}
