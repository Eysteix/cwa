import { getContent } from '~/lib/content'

export function Footer() {
  const { site, footerLinks } = getContent()

  return (
    <footer style={{ background: 'var(--surface)', boxShadow: '0 -1px 0 var(--ink-4)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 800, color: 'var(--ink-2)' }}>
          {site.name.split(' ')[0]}<span style={{ color: 'var(--orange)' }}>.</span>{site.name.split(' ').slice(1).join('').toLowerCase() || 'calc'}
        </span>
        <div style={{ display: 'flex', gap: 18 }}>
          {footerLinks.map(link => (
            <a key={link} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-3)', textDecoration: 'none' }}>
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
