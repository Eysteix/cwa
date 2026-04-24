import { db } from '~/lib/db'
import { requireAuth } from '~/lib/require-auth'
import { calcResults } from '~/lib/calculator'
import { json, preflight } from '~/lib/cors'

export async function loader({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  const [academicStatus, courses] = await Promise.all([
    db.academicStatus.findUnique({ where: { userId: auth } }),
    db.course.findMany({ where: { userId: auth }, orderBy: { createdAt: 'asc' } }),
  ])

  const base = academicStatus
    ? { totalMarks: academicStatus.totalMarks, totalCredits: academicStatus.totalCredits }
    : { totalMarks: 0, totalCredits: 0 }

  const results = calcResults(base, courses)

  return json({
    cwa: results?.newCWA ?? academicStatus?.cwa ?? 0,
    totalCredits: results?.newTotalCredits ?? base.totalCredits,
    totalMarks: results?.newTotalMarks ?? base.totalMarks,
    semesterCredits: results?.semesterCredits ?? 0,
    semesterAverage: results?.semesterAverage ?? 0,
    cwaDelta: results?.cwaDelta ?? 0,
    inputMode: academicStatus?.inputMode ?? 'cwa',
    courses,
  })
}
