'use client'
import { useState } from 'react'


export default function SignupPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [repassword, setRepassword] = useState('')
const [msg, setMsg] = useState('')


async function onSubmit(e: React.FormEvent) {
e.preventDefault()
const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, repassword }) })
const data = await res.json()
if (!res.ok) return setMsg(data.error || 'Signup failed')
window.location.href = '/login'
}


return (
<form onSubmit={onSubmit} className="space-y-3">
<input className="w-full border rounded-lg p-2" placeholder="Мэйл" value={email} onChange={e=>setEmail(e.target.value)} />
<input className="w-full border rounded-lg p-2" placeholder="Нууц үг" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<input className="w-full border rounded-lg p-2" placeholder="Нууц үг давтах" type="password" value={repassword} onChange={e=>setRepassword(e.target.value)} />
<button className="w-full bg-black text-white rounded-lg p-2">Бүртгүүлэх</button>
{msg && <p className="text-red-600 text-sm">{msg}</p>}
</form>
)
}