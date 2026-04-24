import { db } from '~/lib/db'
import { requireAuth } from '~/lib/require-auth'
import { json, preflight } from '~/lib/cors'

export async function loader({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()
  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth
  const courses = await db.course.findMany({ where: { userId: auth }, orderBy: { createdAt: 'asc' } })
  return json(courses)
}

export async function action({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const { name, credits, score } = await request.json()
  if (!name || credits == null || score == null) {
    return json({ error: 'name, credits, and score are required' }, { status: 400 })
  }

  const course = await db.course.create({
    data: { userId: auth, name, credits: Number(credits), score: Number(score) },
  })
  return json(course, { status: 201 })
}
