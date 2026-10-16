import type { Metadata, Viewport } from 'next';
import { Archivo, Doto } from 'next/font/google';
import { bootScript } from '@/lib/boot';
import { jobs, person, siteUrl, skillGroups } from '@/content/profile';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const doto = Doto({
  subsets: ['latin'],
  axes: ['ROND'],
  variable: '--font-doto',
  display: 'swap',
});

const title = `${person.name} | Analista de Sistemas e desenvolvedor de software`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: person.summary,
  applicationName: person.name,
  authors: [{ name: person.name, url: siteUrl }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: 'pt_BR',
    url: '/',
    siteName: person.name,
    title,
    description: person.summary,
    firstName: person.givenName,
    lastName: person.familyName,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: `${person.name}, ${person.roles[1]}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: person.summary,
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#23463a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: jobs[0].title,
  worksFor: { '@type': 'Organization', name: jobs[0].company },
  description: person.summary,
  url: siteUrl,
  image: `${siteUrl}/og.png`,
  email: `mailto:${person.email}`,
  sameAs: [person.linkedin, person.github],
  knowsAbout: skillGroups.flatMap((group) => group.items.map((item) => item.name)),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // O script de boot ajusta atributos data-* do <html> antes da hidratação.
    <html lang="pt-BR" className={`${archivo.variable} ${doto.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
