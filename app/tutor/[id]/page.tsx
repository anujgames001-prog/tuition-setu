'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import type { Listing, Review } from '../../../lib/types'

export default function TutorProfilePage(){
  const params = useParams(); const id = params?.id as string
  const [listing,setListing]=useState<Listing|null>(null); const [reviews,setReviews]=useState<Review[]>([]); const [loading,setLoading]=useState(true); const [note,setNote]=useState(''); const [myRating,setMyRating]=useState(0); const [comment,setComment]=useState(''); const [isStudent,setIsStudent]=useState(false)
  async function loadReviews(){ const {data} = await supabase.from('reviews').select('*').eq('listing_id',id).order('created_at',{ascending:false}); setReviews((data as Review[])||[]) }
  useEffect(()=>{(async()=>{ const {data} = await supabase.from('tutor_listings').select('*').eq('id',id).eq('status','active').single(); setListing(data as Listing); await loadReviews(); const {data:{user}} = await supabase.auth.getUser(); if(user){ const {data:p} = await supabase.from('profiles').select('role').eq('id',user.id).single(); setIsStudent(p?.role==='student') } setLoading(false) })()},[id])
 async function enquire(){ const {data:{user}} = await supabase.auth.getUser(); if(!user){location.href='/auth'; return} if(!listing)return; const {error} = await supabase.from('enquiries').insert({listing_id:listing.id, student_id:user.id, message:`Interested in a free demo for ${listing.title}.`}); if(listing.phone){ const msg=encodeURIComponent(`Hi ${listing.title}, I found your class on TuitionSetu and I'm interested in a free demo.`); window.open(`https://wa.me/91${listing.phone.replace(/\D/g,'')}?text=${msg}`,'_blank') } setNote(error ? (error.code==='23505' ? "You've already sent an enquiry for this class. The tutor has been notified." : error.message) : (listing.phone?'Opening WhatsApp to connect you directly…':`Enquiry sent to ${listing.title}. They will contact you soon.`)) }
