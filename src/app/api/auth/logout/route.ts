// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
const TOKEN_NAME = 'token'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(TOKEN_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
