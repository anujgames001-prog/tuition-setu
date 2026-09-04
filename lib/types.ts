export type Role = 'student' | 'tutor' | 'admin'
export type Listing = { id: string; title: string; category: string; city: string; locality: string | null; fee_from: number | null; fee_to: number | null; modes: string[]; description: string | null; status: 'pending' | 'active' | 'rejected'; rating: number; review_count: number }
export type Enquiry = { id: string; listing_id: string; message: string | null; status: 'new' | 'contacted' | 'closed'; created_at: string }
