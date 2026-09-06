'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Role } from '../../lib/types'

export default function ProfilePage(){
  const [email,setEmail]=useState(''); const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [city,setCity]=useState(''); const [role,setRole]=useState<Role|null>(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [message,setMessage]=useState('')
  useEffect(()=>{(async()=>{const {data:{user}}=await supabase.auth.getUser(); if(!user){location.href='/auth'; return} setEmail(user.email||''); const {data:p}=await supabase.from('profiles').select('full_name,phone,city,role').eq('id',user.id).single(); setName(p?.full_name||''); setPhone(p?.phone||''); setCity(p?.city||''); setRole(p?.role||null); setLoading(false)})()},[])
  async function save(){ setSaving(true); setMessage(''); const {data:{user}}=await supabase.auth.getUser(); if(!user)return; const {error}=await supabase.from('profiles').update({full_name:name,phone,city}).eq('id',user.id); setMessage(error?error.message:'Profile updated.'); setSaving(false) }
  async function logout(){ await supabase.auth.signOut(); location.href='/' }
  if(loading) return <main className="form-page">Loading your profile…</main>
  const roleLabel = role==='tutor' ? 'Tutor / Institute' : role==='admin' ? 'Admin' : 'Student / Parent'
  const initial = (name || email || '?').charAt(0).toUpperCase()
  return <main className="profile-shell">
    <div className="profile-top">
      <div className="avatar-circle">{initial}</div>
      <div><h2>{name || 'Your name'}</h2><p>{email}</p><span className={`role-badge ${role||'student'}`}>{roleLabel}</span></div>
    </div>
    <div className="profile-section">
      <h3>Account details</h3>
      <div className="profile-row"><label>Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" /></div>
      <div className="profile-row"><label>Email</label><span className="static">{email}</span></div>
      <div className="profile-row"><label>Mobile number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Add number" /></div>
      <div className="profile-row"><label>City</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Add city" /></div>
      <button className="primary inline" onClick={save} disabled={saving}>{saving?'Saving…':'Save changes'}</button>
      {message && <p className="notice">{message}</p>}
    </div>
    <div className="logout-row"><button className="logout-btn" onClick={logout}>Log out</button></div>
  </main>
}
