'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Enquiry, Listing, Role } from '../../lib/types'

export default function Dashboard(){
  const [role,setRole]=useState<Role|null>(null); const [items,setItems]=useState<Listing[]>([]); const [enquiries,setEnquiries]=useState<Enquiry[]>([]); const [name,setName]=useState('')
  useEffect(()=>{(async()=>{ const {data:{user}}=await supabase.auth.getUser(); if(!user){location.href='/auth'; return} const {data:p}=await supabase.from('profiles').select('role,full_name').eq('id',user.id).single(); setRole(p?.role); setName(p?.full_name||''); if(p?.role==='tutor'){ const {data:l}=await supabase.from('tutor_listings').select('*').eq('owner_id',user.id); setItems(l||[]); const ids=(l||[]).map(x=>x.id); if(ids.length){ const {data:e}=await supabase.from('enquiries').select('*').in('listing_id',ids).order('created_at',{ascending:false}); setEnquiries(e||[]) } } else { const {data:e}=await supabase.from('enquiries').select('*').eq('student_id',user.id).order('created_at',{ascending:false}); setEnquiries(e||[]) } })()},[])
  return <main className="dash">
    <div className="dash-welcome"><p className="eyebrow">YOUR TUITIONSETU ACCOUNT</p><h1>Hello{name?`, ${name}`:''} 👋</h1></div>
    {role==='tutor' && <div className="dash-section"><div className="dash-section-head"><h2>Your listings</h2><a className="primary inline" href="/tutor/new">+ Add listing</a></div>{items.length ? <div className="status-list">{items.map(x=><div className="dash-card" key={x.id}><div style={{display:'flex',alignItems:'center',gap:14}}><div className="dash-icon">🎓</div><div><b>{x.title}</b><small>{x.category} · {x.city}</small></div></div><span className={`badge-pill ${x.status}`}>{x.status}</span></div>)}</div> : <div className="dash-empty">You haven't created a listing yet. <a href="/tutor/new">Add one now →</a></div>}</div>}
    <div className="dash-section"><div className="dash-section-head"><h2>{role==='tutor' ? 'Incoming enquiries' : 'Your enquiries'}</h2></div>{enquiries.length ? <div className="status-list">{enquiries.map(x=><div className="dash-card" key={x.id}><div style={{display:'flex',alignItems:'center',gap:14}}><div className="dash-icon">💬</div><div><b>Enquiry #{x.id.slice(0,8)}</b><small>{new Date(x.created_at).toLocaleDateString()} · {x.message}</small></div></div><span className={`badge-pill ${x.status}`}>{x.status}</span></div>)}</div> : <div className="dash-empty">No enquiries yet.</div>}</div>
    <button className="link-btn dash-logout" onClick={async()=>{await supabase.auth.signOut(); location.href='/'}}>Log out</button>
  </main>
}
