// src/app/page.tsx
import { redirect } from 'next/navigation'
import { getAuth } from '@/lib/auth'

export default async function Home() {
  const auth = await getAuth()
  redirect(auth ? '/product/list' : '/login')
}
