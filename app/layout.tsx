import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'TuitionSetu', description: 'Find trusted local tutors and coaching classes.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><header className="site-header"><a href="/" className="brand"><span>t</span> TuitionSetu</a><nav><a href="/student">Find classes</a><a href="/tutor/new">For tutors</a><a href="/auth">Log in</a></nav></header>{children}<footer>© 2026 TuitionSetu · Making local learning easier.</footer></body></html>
}
