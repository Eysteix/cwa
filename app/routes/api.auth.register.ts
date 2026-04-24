import { auth } from '~/lib/auth'
import { signJWT } from '~/lib/jwt'
import { json, preflight } from '~/lib/cors'

export async function action({ request }: { request: Request }) {
  if (request.method === 'OPTIONS') return preflight()
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, { status: 405 })

  const { email, password, name } = await request.json()
  if (!email || !password || !name) return json({ error: 'email, password, and name are required' }, { status: 400 })

  const signUpReq = new Request(new URL('/api/auth/sign-up/email', request.url), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  const authResp = await auth.handler(signUpReq)

  if (!authResp.ok) {
    const body = await authResp.json().catch(() => ({}))
    return json({ error: (body as { message?: string }).message ?? 'Registration failed' }, { status: 400 })
  }

  const body = await authResp.json() as { user: { id: string; email: string; name: string } }
  const token = signJWT(body.user.id)
  return json({ token, user: { id: body.user.id, email: body.user.email, name: body.user.name } }, { status: 201 })
}
