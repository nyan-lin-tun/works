import type { Metadata } from 'next';
import Link from 'next/link';
import { getSite } from '../lib/content';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import './globals.css';

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL('https://nyanlintun.me/works/'),
  title: { default: `${site.title} — ${site.name}`, template: `%s — ${site.name}` },
  description: site.description,
  icons: { icon: '/works/favicon.svg' },
  openGraph: {
    title: `${site.title} — ${site.name}`,
    description: site.description,
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The theme initializer sets only the root theme attributes before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <div className="root mx-auto flex min-h-dvh max-w-6xl flex-col px-6 sm:px-12 lg:px-16">
            <header className="flex min-h-28 flex-wrap items-center justify-between gap-5 py-7 sm:min-h-36">
              <Link className="identity text-sm font-medium tracking-tight" href="/">
                {site.name}
                <span className="ml-1 text-accent">.</span>
              </Link>
              <nav aria-label="Main navigation" className="flex items-center gap-6 sm:gap-8">
                <Link className="nav-link" href="/">
                  Works
                </Link>
                <ThemeToggle />
              </nav>
            </header>
            <main id="main" className="flex-1">
              {children}
            </main>
            <footer className="mt-24 flex flex-col justify-between gap-3 border-t border-line py-8 text-xs text-muted sm:mt-36 sm:flex-row">
              <span>
                © {new Date().getFullYear()} {site.name}
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <span>{site.footer}</span>
                <a href="https://github.com/nyan-lin-tun" className="hover:text-foreground">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
