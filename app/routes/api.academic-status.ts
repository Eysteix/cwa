import { db } from '~/lib/db'
import { requireAuth } from '~/lib/require-auth'
import { json, preflight } from '~/lib/cors'

export async function loader({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()
  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth
  const status = await db.academicStatus.findUnique({ where: { userId: auth } })
  return json(status)
}

export async function action({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()
  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const body = await request.json() as {
    inputMode?: string; cwa?: number; totalMarks?: number; totalCredits?: number
    university?: string; programme?: string; yearOfStudy?: number | null; semester?: number | null
  }

  const status = await db.academicStatus.upsert({
    where: { userId: auth },
    create: {
      userId: auth,
      inputMode: body.inputMode ?? 'cwa',
      cwa: body.cwa ?? 0,
      totalMarks: body.totalMarks ?? 0,
      totalCredits: body.totalCredits ?? 0,
      university: body.university,
      programme: body.programme,
      yearOfStudy: body.yearOfStudy ?? null,
      semester: body.semester ?? null,
    },
    update: {
      ...(body.inputMode !== undefined && { inputMode: body.inputMode }),
      ...(body.cwa !== undefined && { cwa: body.cwa }),
      ...(body.totalMarks !== undefined && { totalMarks: body.totalMarks }),
      ...(body.totalCredits !== undefined && { totalCredits: body.totalCredits }),
      ...(body.university !== undefined && { university: body.university }),
      ...(body.programme !== undefined && { programme: body.programme }),
      ...(body.yearOfStudy !== undefined && { yearOfStudy: body.yearOfStudy }),
      ...(body.semester !== undefined && { semester: body.semester }),
    },
  })
  return json(status)
}
