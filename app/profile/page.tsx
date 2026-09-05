'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Role } from '../../lib/types'

export default function ProfilePage(){
  const [email,setEmail]=useState(''); const [name,setName]=useState(''); const [role,setRole]=useState<Role|null>(null); const [loading,setLoading]=useState(true)
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser(); if(!user){location.href='/auth'; return} setEmail(user.email||''); const {data:p}=await supabase.from('profiles').select('full_name,role').eq('id',user.id).single(); setName(p?.full_name||''); setRole(p?.role||null); setLoading(false)})()},[])
  async function logout(){ await supabase.auth.signOut(); location.href='/' }
  if(loading) return <main className="form-page">Loading your profile…</main>
  return <main className="form-page"><div className="form-card"><p className="eyebrow">YOUR ACCOUNT</p><h2>Profile details</h2><p><b>Name:</b> {name || 'Not set'}</p><p><b>Email:</b> {email}</p><p><b>Account type:</b> {role==='tutor' ? 'Tutor / Institute' : role==='admin' ? 'Admin' : 'Student / Parent'}</p><a className="primary inline" href="/dashboard">Go to dashboard</a><button className="link-btn" onClick={logout}>Log out</button></div></main>
}
