import { Link } from 'react-router'
import { useSession, signOut } from '~/lib/auth-client'

export function Header() {
  const { data: session } = useSession()

  return (
    <header style={{ background: '#0a0a0a', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        padding: '0 24px', height: 54,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1 }} aria-label="FirstTarget home">
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            First
          </span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 800, color: 'var(--orange)', letterSpacing: '-0.5px' }}>
            Target
          </span>
        </Link>

        <nav aria-label="Account navigation" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {session ? (
            <>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#a1a1aa' }} aria-label={`Signed in as ${session.user.email}`}>
                {session.user.email}
              </span>
              <button
                onClick={() => signOut()}
                style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#e4e4e7', background: 'none', border: '1px solid #3f3f46', padding: '6px 14px', borderRadius: 'var(--r)', cursor: 'pointer' }}
                aria-label="Sign out of your account"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth/sign-in"
              style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--orange)', border: 'none', padding: '7px 18px', borderRadius: 'var(--r)', textDecoration: 'none', display: 'inline-block' }}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
