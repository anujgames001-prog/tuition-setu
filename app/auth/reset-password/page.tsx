'use client'
import { FormEvent, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function ResetPasswordPage() {
  const [message, setMessage] = useState(''); const [done, setDone] = useState(false)
  async function updatePassword(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget); const password = String(f.get('password')); setMessage(''); const result = await supabase.auth.updateUser({ password }); setMessage(result.error ? result.error.message : 'Password updated. Redirecting…'); if (!result.error) { setDone(true); setTimeout(()=>{ location.href = '/dashboard' }, 1500) } }
  return <main className="auth-shell"><section className="auth-card"><p className="eyebrow">RESET PASSWORD</p><h1>Choose a new password</h1><p className="subtle">Enter a new password for your account.</p>{!done && <form onSubmit={updatePassword}><input required name="password" type="password" minLength={8} placeholder="New password (at least 8 characters)" /><button className="primary">Update password</button></form>}{message && <p className="notice">{message}</p>}</section></main>
}
