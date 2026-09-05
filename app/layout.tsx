import type { Metadata } from 'next'
import './globals.css'
import Header from './components/Header'

export const metadata: Metadata = { title: 'TuitionSetu', description: 'Find trusted local tutors and coaching classes.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header />{children}<footer>© 2026 TuitionSetu · Making local learning easier.</footer></body></html>
}
