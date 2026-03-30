import { Link } from 'react-router'
import { useSession, signOut } from '~/lib/auth-client'

export function Header() {
  const { data: session } = useSession()

  return (
    <header style={{
      background: 'var(--surface)',
      boxShadow: 'var(--sh-sm)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        padding: '0 24px', height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.4px' }}>
            CWA
          </span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Calculator
          </span>
        </Link>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {session ? (
            <>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-3)' }}>
                {session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', background: 'none', border: '1px solid var(--ink-4)', padding: '6px 14px', borderRadius: 'var(--r)', cursor: 'pointer' }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/sign-up" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', background: 'none', border: '1px solid var(--ink-4)', padding: '6px 14px', borderRadius: 'var(--r)', textDecoration: 'none', display: 'inline-block' }}>
                Register
              </Link>
              <Link to="/auth/sign-in" style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--orange)', border: 'none', padding: '7px 16px', borderRadius: 'var(--r)', textDecoration: 'none', display: 'inline-block' }}>
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
