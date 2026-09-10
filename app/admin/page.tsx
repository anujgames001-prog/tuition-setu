'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Listing } from '../../lib/types'

type Msg = { id:string; name:string; email:string; message:string; created_at:string }

export default function Admin(){
  const [allowed,setAllowed]=useState<boolean|null>(null); const [pending,setPending]=useState<Listing[]>([]); const [messages,setMessages]=useState<Msg[]>([]); const [note,setNote]=useState('')
  async function load(){ const {data:{user}}=await supabase.auth.getUser(); if(!user){location.href='/auth'; return} const {data:p}=await supabase.from('profiles').select('role').eq('id',user.id).single(); if(p?.role!=='admin'){setAllowed(false); return} setAllowed(true); const {data}=await supabase.from('tutor_listings').select('*').eq('status','pending').order('created_at'); setPending(data||[]); const {data:m}=await supabase.from('support_messages').select('*').order('created_at',{ascending:false}); setMessages(m||[]) }
  useEffect(()=>{load()},[])
  async function review(id:string,status:'active'|'rejected'){ const {error}=await supabase.from('tutor_listings').update({status}).eq('id',id); setNote(error?error.message:`Listing ${status}.`); if(!error)load() }
  if(allowed===null) return <main className="dash">Checking admin permissions…</main>
  if(!allowed) return <main className="dash"><h1>Admin access only.</h1><p>Assign your user the <code>admin</code> role once from Supabase after initial setup.</p></main>
  return <main className="dash">
    <div className="dash-welcome"><p className="eyebrow">ADMIN DASHBOARD</p><h1>Manage TuitionSetu</h1></div>
    {note && <p className="notice">{note}</p>}
    <div className="dash-section"><div className="dash-section-head"><h2>Pending listing verification</h2></div>{pending.length ? <div className="status-list">{pending.map(x=><div className="dash-card" key={x.id}><div style={{display:'flex',alignItems:'center',gap:14}}><div className="dash-icon">🎓</div><div><b>{x.title}</b><small>{x.category} · {x.locality ? `${x.locality}, `:''}{x.city}<br/>{x.description}</small></div></div><div><button className="approve" onClick={()=>review(x.id,'active')}>Approve</button><button className="reject" onClick={()=>review(x.id,'rejected')}>Reject</button></div></div>)}</div> : <div className="dash-empty">No pending listings. You're all caught up.</div>}</div>
    <div className="dash-section"><div className="dash-section-head"><h2>Customer messages</h2></div>{messages.length ? <div className="status-list">{messages.map(m=><div className="dash-card" key={m.id}><div style={{display:'flex',alignItems:'center',gap:14}}><div className="dash-icon">✉️</div><div><b>{m.name} <span style={{color:'var(--muted)',fontWeight:400}}>· {m.email}</span></b><small>{new Date(m.created_at).toLocaleDateString()} · {m.message}</small></div></div><a className="link-btn" href={`mailto:${m.email}`}>Reply</a></div>)}</div> : <div className="dash-empty">No messages yet.</div>}</div>
  </main>
}
