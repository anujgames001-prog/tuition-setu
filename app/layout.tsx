import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'

export const metadata: Metadata = {
  title: 'TuitionSetu — Find Trusted Local Tutors & Coaching Classes in India',
  description: 'Search verified tutors and coaching institutes near you. Compare fees, batches and reviews, then request a free demo — completely free for students.',
  keywords: ['tuition', 'tutors near me', 'coaching classes', 'home tuition', 'online tuition India'],
  openGraph: { title: 'TuitionSetu — Find the right class, the right future.', description: 'Search verified tutors and coaching institutes near you.', type: 'website' }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<footer>© 2026 TuitionSetu · Making local learning easier.</footer></body></html>
}
