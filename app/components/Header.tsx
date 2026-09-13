'use client'
import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

const TITLES: Record<string,string> = { '/':'TuitionSetu — Find trusted tutors near you', '/student':'Find Classes — TuitionSetu', '/tutor/new':'List Your Classes — TuitionSetu', '/auth':'Log in or Sign up — TuitionSetu', '/dashboard':'Dashboard — TuitionSetu', '/profile':'My Profile — TuitionSetu', '/admin':'Admin — TuitionSetu' }

export default function Header(){
  const [loggedIn,setLoggedIn]=useState(false); const [name,setName]=useState(''); const [open,setOpen]=useState(false); const pathname = usePathname(); const menuRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{ async function check(){ const {data:{user}}=await supabase.auth.getUser(); setLoggedIn(!!user); if(user){ const {data:p}=await supabase.from('profiles').select('full_name').eq('id',user.id).single(); setName(p?.full_name?.split(' ')[0]||'') } } check(); const {data:sub}=supabase.auth.onAuthStateChange(()=>check()); return ()=>sub.subscription.unsubscribe() },[])
  useEffect(()=>{ document.title = TITLES[pathname] || 'TuitionSetu' },[pathname])
  useEffect(()=>{ function onClick(e:MouseEvent){ if(menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false) } document.addEventListener('click',onClick); return ()=>document.removeEventListener('click',onClick) },[])
  const initial = (name || '?').charAt(0).toUpperCase()
  return <header className="site-header"><a href="/" className="brand"><span className="logo-mark"><svg width="20" height="20" viewBox="0 0 64 64"><path d="M32 18L14 26l18 8 18-8-18-8z" fill="white"/><path d="M22 32v8c0 3 4.5 6 10 6s10-3 10-6v-8" stroke="white" strokeWidth="2.5" fill="none"/></svg></span> TuitionSetu</a><nav><a href="/student">Find classes</a><a href="/tutor/new">For tutors</a><a href="/contact">Contact</a>{loggedIn ? <div className="account-menu" ref={menuRef}><button className="account-trigger" onClick={()=>setOpen(!open)}>{name && <span className="hi-text">Hi, {name}</span>}<span className="avatar-badge">{initial}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`chev ${open?'up':''}`}><path d="M6 9l6 6 6-6"/></svg></button>{open && <div className="account-dropdown"><a href="/dashboard">Dashboard</a><a href="/profile">My Profile</a><button onClick={async()=>{await supabase.auth.signOut(); location.href='/'}}>Log out</button></div>}</div> : <a href="/auth">Log in</a>}</nav></header>
}
