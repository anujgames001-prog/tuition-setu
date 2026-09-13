'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const TITLES: Record<string,string> = { '/':'TuitionSetu — Find trusted tutors near you', '/student':'Find Classes — TuitionSetu', '/tutor/new':'List Your Classes — TuitionSetu', '/auth':'Log in or Sign up — TuitionSetu', '/dashboard':'Dashboard — TuitionSetu', '/profile':'My Profile — TuitionSetu', '/admin':'Admin — TuitionSetu' }

export default function Header(){
  const [loggedIn,setLoggedIn]=useState(false); const pathname = usePathname()
  useEffect(()=>{ supabase.auth.getUser().then(({data:{user}})=>setLoggedIn(!!user)); const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>setLoggedIn(!!session)); return ()=>sub.subscription.unsubscribe() },[])
  useEffect(()=>{ document.title = TITLES[pathname] || 'TuitionSetu' },[pathname])
  return <header className="site-header"><a href="/" className="brand"><span className="logo-mark"><svg width="20" height="20" viewBox="0 0 64 64"><path d="M32 18L14 26l18 8 18-8-18-8z" fill="white"/><path d="M22 32v8c0 3 4.5 6 10 6s10-3 10-6v-8" stroke="white" strokeWidth="2.5" fill="none"/></svg></span> TuitionSetu</a><nav><a href="/student">Find classes</a><a href="/tutor/new">For tutors</a><a href="/contact">Contact</a>{loggedIn && <a href="/dashboard">Dashboard</a>}{loggedIn ? <a href="/profile">👤 Profile</a> : <a href="/auth">Log in</a>}</nav></header>
}
