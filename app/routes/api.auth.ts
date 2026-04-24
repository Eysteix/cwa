import { auth } from '~/lib/auth'
import { signJWT } from '~/lib/jwt'
import { json, preflight } from '~/lib/cors'

export async function action({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const { email, password } = await request.json()
  if (!email || !password) return json({ error: 'email and password are required' }, { status: 400 })

  const signInReq = new Request(new URL('/api/auth/sign-in/email', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const authResp = await auth.handler(signInReq)

  if (!authResp.ok) {
    const body = await authResp.json().catch(() => ({}))
    return json({ error: (body as { message?: string }).message ?? 'Invalid credentials' }, { status: 401 })
  }

  const body = await authResp.json() as { user: { id: string; email: string; name: string } }
  const token = signJWT(body.user.id)
  return json({ token, user: { id: body.user.id, email: body.user.email, name: body.user.name } })
}
