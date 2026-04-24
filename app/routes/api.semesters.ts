import { db } from '~/lib/db'
import { requireAuth } from '~/lib/require-auth'
import { json, preflight } from '~/lib/cors'

export async function loader({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  const semesters = await db.semester.findMany({
    where: { userId: auth },
    orderBy: { createdAt: 'asc' },
  })
  return json(semesters.map(s => ({ ...s, courses: JSON.parse(s.courses) })))
}

export async function action({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const { label, courses } = await request.json()
  if (!label) return json({ error: 'label is required' }, { status: 400 })

  const semester = await db.semester.create({
    data: { userId: auth, label, courses: JSON.stringify(courses ?? []) },
  })
  return json({ ...semester, courses: JSON.parse(semester.courses) }, { status: 201 })
}
