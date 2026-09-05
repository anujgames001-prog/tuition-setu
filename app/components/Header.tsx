'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Header(){
  const [loggedIn,setLoggedIn]=useState(false)
  useEffect(()=>{ supabase.auth.getUser().then(({data:{user}})=>setLoggedIn(!!user)); const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>setLoggedIn(!!session)); return ()=>sub.subscription.unsubscribe() },[])
  return <header className="site-header"><a href="/" className="brand"><span>t</span> TuitionSetu</a><nav><a href="/student">Find classes</a><a href="/tutor/new">For tutors</a>{loggedIn ? <a href="/profile">👤 Profile</a> : <a href="/auth">Log in</a>}</nav></header>
}
