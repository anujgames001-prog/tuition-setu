'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Listing } from '../../lib/types'
import { CITIES } from '../../lib/cities'

export default function StudentPage() {
  const [listings, setListings] = useState<Listing[]>([]); const [query, setQuery] = useState(''); const [city, setCity] = useState('Jaipur'); const [note, setNote] = useState(''); const [loading, setLoading] = useState(true); const [locating, setLocating] = useState(false)
async function load() { setLoading(true); let request = supabase.from('tutor_listings').select('*').eq('status','active').order('created_at',{ascending:false}); if (city.trim()) request=request.ilike('city',`%${city.trim()}%`); const { data, error } = await request; setListings(error ? [] : data as Listing[]); setLoading(false) }
