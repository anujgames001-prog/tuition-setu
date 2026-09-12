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
  return <html lang="en"><body><Header />{children}<footer className="site-footer"><div className="footer-grid"><div className="footer-col"><h4>TuitionSetu</h4><p>Helping families find trusted local tutors and coaching classes, and helping great teachers get discovered.</p></div><div className="footer-col"><h4>Quick links</h4><a href="/student">Find classes</a><a href="/tutor/new">List your classes</a><a href="/contact">Contact us</a></div><div className="footer-col"><h4>Get in touch</h4><a href="https://wa.me/916263433081" target="_blank">WhatsApp: +91 62634 33081</a><a href="mailto:singhmodex@gmail.com">singhmodex@gmail.com</a></div></div><div className="footer-bottom">© 2026 TuitionSetu · Making local learning easier. · <a href="/terms" style={{color:'inherit'}}>Terms</a> · <a href="/privacy" style={{color:'inherit'}}>Privacy</a></div></footer></body></html>
}
