import { auth } from './auth'
import { verifyJWT } from './jwt'
import { json } from './cors'

export async function requireAuth(request: Request): Promise<string | Response> {
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const userId = verifyJWT(authHeader.slice(7))
    if (userId) return userId
    return json({ error: 'Invalid token' }, { status: 401 })
  }

  const session = await auth.api.getSession({ headers: request.headers })
  if (session?.user?.id) return session.user.id

  return json({ error: 'Unauthorized' }, { status: 401 })
}
