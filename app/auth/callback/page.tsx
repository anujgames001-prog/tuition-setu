'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AuthCallback(){
  const [status,setStatus]=useState('Verifying your email…')
  useEffect(()=>{(async()=>{ const {data:{session}} = await supabase.auth.getSession(); if(session){ location.href='/dashboard' } else { setStatus('This link is invalid or has expired. Please log in again.') } })()},[])
  return <main className="auth-shell"><section className="auth-card"><p className="eyebrow">EMAIL VERIFICATION</p><h1>{status}</h1>{status.includes('invalid') && <a className="primary inline" href="/auth">Back to log in</a>}</section></main>
}
