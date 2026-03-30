import { useState } from 'react'
import { Link, useNavigate, useLoaderData } from 'react-router'
import { signUp, signIn } from '~/lib/auth-client'
import { StudentIllustration } from '~/components/auth/student-illustration'
import { getContent } from '~/lib/content'
import type { Route } from './+types/auth.sign-up'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Register — CWA Calculator' }]
}

export async function loader(_: Route.LoaderArgs) {
  const { auth } = getContent()
  return { auth }
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const { auth } = useLoaderData<typeof loader>()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await signUp.email({ name, email, password })
    setLoading(false)
    if (res.error) { setError(res.error.message ?? 'Registration failed'); return }
    navigate('/')
  }

  async function handleGoogle() {
    await signIn.social({ provider: 'google', callbackURL: '/' })
  }

  const inputStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, width: '100%', background: 'var(--bg)', border: 'none', outline: 'none', padding: '11px 14px', borderRadius: 5, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)', color: 'var(--ink)' }
  const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-3)', display: 'block', marginBottom: 5 }

  return (
    <div className="auth-grid" style={{ minHeight: '100vh' }}>
      <div className="auth-left-panel" style={{ background: '#27272a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <Link to="/" style={{ position: 'absolute', top: 28, left: 32, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 7, zIndex: 2 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 800, color: 'white' }}>CWA</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Calculator</span>
        </Link>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 380 }}><StudentIllustration /></div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'white', lineHeight: 1.25 }}>
            Plan your path to <span style={{ color: 'var(--orange)' }}>academic success</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#a1a1aa', marginTop: 10, lineHeight: 1.6 }}>{auth.body}</p>
        </div>
      </div>
      <div className="auth-right-panel" style={{ background: 'var(--surface)', display: 'flex', flexDirection: 'column', padding: '0 56px', justifyContent: 'center', position: 'relative' }}>
        <Link to="/" style={{ position: 'absolute', top: 28, left: 56, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', color: 'var(--ink-3)', textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back to calculator
        </Link>
        <div style={{ width: '100%' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 4 }}>Create your account</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink-3)', marginBottom: 28 }}>Save your progress and access it anywhere</p>
          <button onClick={handleGoogle} type="button" style={{ fontFamily: 'var(--font-body)', width: '100%', padding: '13px 16px', background: 'var(--surface)', border: '1.5px solid var(--ink-4)', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 18, boxShadow: 'var(--sh-sm)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--ink-4)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or email</span>
            <div style={{ flex: 1, height: 1, background: 'var(--ink-4)' }} />
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required style={inputStyle} /></div>
            <div style={{ marginBottom: 14 }}><label style={labelStyle}>Email address</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={inputStyle} /></div>
            <div style={{ marginBottom: 6 }}><label style={labelStyle}>Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required minLength={8} style={inputStyle} /></div>
            {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#ef4444', marginBottom: 8 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ fontFamily: 'var(--font-heading)', width: '100%', padding: 13, background: 'var(--ink)', color: 'white', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 6 }}>{loading ? 'Creating account…' : 'Create account'}</button>
          </form>
          <p style={{ fontFamily: 'var(--font-body)', marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
            Already have an account? <Link to="/auth/sign-in" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
