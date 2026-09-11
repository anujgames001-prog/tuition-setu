'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Listing } from '../../lib/types'
import { CITIES } from '../../lib/cities'

export default function StudentPage() {
  const [listings, setListings] = useState<Listing[]>([]); const [query, setQuery] = useState(''); const [city, setCity] = useState('Jaipur'); const [note, setNote] = useState(''); const [loading, setLoading] = useState(true)
  async function load() { setLoading(true); let request = supabase.from('tutor_listings').select('*').eq('status','active').order('created_at',{ascending:false}); if (city) request=request.ilike('city',`%${city}%`); const { data, error } = await request; setListings(error ? [] : data as Listing[]); setLoading(false) }
  useEffect(()=>{ load() },[])
  async function enquire(listing: Listing) { const { data: { user } } = await supabase.auth.getUser(); if (!user) { location.href='/auth'; return } const { error } = await supabase.from('enquiries').insert({ listing_id: listing.id, student_id: user.id, message: `Interested in a free demo for ${listing.title}.` }); if(listing.phone){ const msg=encodeURIComponent(`Hi ${listing.title}, I found your class on TuitionSetu and I'm interested in a free demo.`); window.open(`https://wa.me/91${listing.phone.replace(/\D/g,'')}?text=${msg}`,'_blank') } setNote(error ? error.message : (listing.phone ? 'Opening WhatsApp to connect you directly…' : `Enquiry sent to ${listing.title}. They will contact you soon.`)) }
  const visible =
