import { createClient } from '@supabase/supabase-js'

export default async function sitemap() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
  const { data } = await supabase.from('tutor_listings').select('id').eq('status','active')
  const base = 'https://tuition-setu-jxjo.vercel.app'
  const staticPages = [{ url: base, lastModified: new Date() }, { url: `${base}/student`, lastModified: new Date() }, { url: `${base}/tutor/new`, lastModified: new Date() }]
  const listingPages = (data || []).map((l: any) => ({ url: `${base}/tutor/${l.id}`, lastModified: new Date() }))
  return [...staticPages, ...listingPages]
}
