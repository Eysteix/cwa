import { db } from '~/lib/db'
import { requireAuth } from '~/lib/require-auth'
import { json, preflight } from '~/lib/cors'

export async function action({ request, params }: { request: Request; params: { id: string } }) {
  if (request.method === 'OPTIONS') return preflight()

  const auth = await requireAuth(request)
  if (auth instanceof Response) return auth

  if (request.method === 'PUT') {
    const { name, credits, score } = await request.json()
    const result = await db.course.updateMany({
      where: { id: params.id, userId: auth },
      data: {
        ...(name !== undefined && { name }),
        ...(credits !== undefined && { credits: Number(credits) }),
        ...(score !== undefined && { score: Number(score) }),
      },
    })
    if (result.count === 0) return json({ error: 'Not found' }, { status: 404 })
    const updated = await db.course.findFirst({ where: { id: params.id } })
    return json(updated)
  }

  if (request.method === 'DELETE') {
    const result = await db.course.deleteMany({ where: { id: params.id, userId: auth } })
    if (result.count === 0) return json({ error: 'Not found' }, { status: 404 })
    return json({ ok: true })
  }

  return json({ error: 'Method not allowed' }, { status: 405 })
}
