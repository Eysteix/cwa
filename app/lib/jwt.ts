import jwt from 'jsonwebtoken'

function secret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET is not set')
  return s
}

export function signJWT(userId: string): string {
  return jwt.sign({ sub: userId }, secret(), { expiresIn: '30d' })
}

export function verifyJWT(token: string): string | null {
  try {
    const payload = jwt.verify(token, secret()) as { sub?: string }
    return payload.sub ?? null
  } catch {
    return null
  }
}
