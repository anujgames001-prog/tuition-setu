'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import type { Listing } from '../../../lib/types'

export default function TutorProfilePage(){
  const params = useParams(); const id = params?.id as string
  const [listing,setListing]=useState<Listing|null>(null); const [loading,setLoading]=useState(true); const [note,setNote]=useState('')
  useEffect(()=>{(async()=>{ const {data} = await supabase.from('tutor_listings').select('*').eq('id',id).eq('status','active').single(); setListing(data as Listing); setLoading(false) })()},[id])
  async function enquire(){ const {data:{user}} = await supabase.auth.getUser(); if(!user){location.href='/auth'; return} if(!listing)return; const {error} = await supabase.from('enquiries').insert({listing_id:listing.id, student_id:user.id, message:`Interested in a free demo for ${listing.title}.`}); setNote(error?error.message:`Enquiry sent to ${listing.title}. They will contact you soon.`) }
  if(loading) return <main className="tutor-page"><div className="skeleton tutor-cover"/><div className="tutor-body"><div className="skeleton tutor-skel-line"/><div className="skeleton tutor-skel-line short"/></div></main>
  if(!listing) return <main className="tutor-page"><div className="tutor-body"><h1>This listing isn't available.</h1><a className="primary inline" href="/student">Back to search</a></div></main>
  return <main className="tutor-page"><div className="tutor-cover">{listing.photo_url ? <img src={listing.photo_url} alt={listing.title} className="cover-img" /> : listing.category.slice(0,1)}</div><div className="tutor-body"><span className="verified">✓ VERIFIED</span><h1>{listing.title}</h1><p className="tutor-meta">{listing.category} · {listing.locality ? `${listing.locality}, ` : ''}{listing.city}</p>{listing.rating>0 && <p className="tutor-rating">★ {listing.rating.toFixed(1)} ({listing.review_count} reviews)</p>}<p className="tutor-desc">{listing.description || 'This tutor has not added a description yet.'}</p><div className="tutor-tags">{listing.modes.map(m=><span key={m} className="tag">{m}</span>)}</div><div className="tutor-cta"><b>{listing.fee_from ? `From ₹${listing.fee_from}${listing.fee_to?` – ₹${listing.fee_to}`:''}/month` : 'Fees on enquiry'}</b><button className="primary" onClick={enquire}>Get free demo →</button></div>{note && <p className="notice">{note}</p>}</div></main>
}
