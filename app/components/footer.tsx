import type { SiteContent } from '~/lib/content'

interface Props {
  site: SiteContent['site']
  footerLinks: SiteContent['footerLinks']
}

export function Footer({ site, footerLinks }: Props) {
  return (
    <footer style={{ background: '#0a0a0a', marginTop: 'auto' }} role="contentinfo">
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 800, color: '#fff' }}>
          {site.name.split(' ')[0]}<span style={{ color: 'var(--orange)' }}>.</span>{site.name.split(' ').slice(1).join('').toLowerCase() || 'calc'}
        </span>
        <nav aria-label="Footer links" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {footerLinks.map(link => (
            <a key={link} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#71717a', textDecoration: 'none' }}>
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
