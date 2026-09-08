'use client'
import { FormEvent, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ContactPage(){
  const [message,setMessage]=useState('')
  async function submit(e: FormEvent<HTMLFormElement>){ e.preventDefault(); const form=e.currentTarget; const f=new FormData(form); const {error}=await supabase.from('support_messages').insert({name:String(f.get('name')),email:String(f.get('email')),message:String(f.get('message'))}); setMessage(error?error.message:'Thanks! We will get back to you within 24 hours.'); if(!error)form.reset() }
  return <main className="form-page"><div className="form-copy"><p className="eyebrow">WE'RE HERE TO HELP</p><h1>Get in touch with us.</h1><p>Have a question, issue, or feedback? Reach out directly or send us a message — we usually reply within a day.</p></div><div className="contact-page" style={{display:'block'}}><div className="contact-options"><a className="contact-card whatsapp" href="https://wa.me/916263433081" target="_blank"><i>💬</i><div><b>Chat on WhatsApp</b><span>+91 62634 33081 · Fastest response</span></div></a><a className="contact-card mail" href="mailto:singhmodex@gmail.com"><i>✉️</i><div><b>Email us</b><span>singhmodex@gmail.com</span></div></a></div><form className="form-card" onSubmit={submit} style={{marginTop:20}}><h2>Send a message</h2><input required name="name" placeholder="Your name" /><input required name="email" type="email" placeholder="Your email" /><textarea required name="message" placeholder="How can we help?" /><button className="primary">Send message</button>{message && <p className="notice">{message}</p>}</form></div></main>
}
