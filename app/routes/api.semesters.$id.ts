import { db } from '~/lib/db'
import { requireAuth } from '~/lib/require-auth'
import { json, preflight } from '~/lib/cors'

export async function loader({ request, params }: { request: Request; params: { id: string } }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  const semester = await db.semester.findFirst({ where: { id: params.id, userId: auth } })
  if (!semester) return json({ error: 'Not found' }, { status: 404 })
  return json({ ...semester, courses: JSON.parse(semester.courses) })
}

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  if (request.method === 'PUT') {
    const { label, courses } = await request.json()
    const semester = await db.semester.updateMany({
      where: { id: params.id, userId: auth },
      data: {
        ...(label !== undefined && { label }),
        ...(courses !== undefined && { courses: JSON.stringify(courses) }),
      },
    })
    if (semester.count === 0) return json({ error: 'Not found' }, { status: 404 })
    const updated = await db.semester.findFirst({ where: { id: params.id } })
    return json(updated ? { ...updated, courses: JSON.parse(updated.courses) } : null)
  }

  if (request.method === 'DELETE') {
    const result = await db.semester.deleteMany({ where: { id: params.id, userId: auth } })
    if (result.count === 0) return json({ error: 'Not found' }, { status: 404 })
    return json({ ok: true })
  }

  return json({ error: 'Method not allowed' }, { status: 405 })
}
