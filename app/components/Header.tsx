'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const TITLES: Record<string,string> = { '/':'TuitionSetu — Find trusted tutors near you', '/student':'Find Classes — TuitionSetu', '/tutor/new':'List Your Classes — TuitionSetu', '/auth':'Log in or Sign up — TuitionSetu', '/dashboard':'Dashboard — TuitionSetu', '/profile':'My Profile — TuitionSetu', '/admin':'Admin — TuitionSetu' }

export default function Header(){
  const [loggedIn,setLoggedIn]=useState(false); const pathname = usePathname()
  useEffect(()=>{ supabase.auth.getUser().then(({data:{user}})=>setLoggedIn(!!user)); const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>setLoggedIn(!!session)); return ()=>sub.subscription.unsubscribe() },[])
  useEffect(()=>{ document.title = TITLES[pathname] || 'TuitionSetu' },[pathname])
  return <header className="site-header"><a href="/" className="brand"><span>t</span> TuitionSetu</a><nav><a href="/student">Find classes</a><a href="/tutor/new">For tutors</a>{loggedIn ? <a href="/profile">👤 Profile</a> : <a href="/auth">Log in</a>}</nav></header>
}
