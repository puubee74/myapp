// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { signJwt } from '@/lib/auth'

const TOKEN_NAME = 'token'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Мэйл хаяг оруулна уу' }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return NextResponse.json({ error: 'Нууц үг буруу' }, { status: 401 })

  const token = signJwt({ id: user.id, email: user.email })
  const res = NextResponse.json({ id: user.id, email: user.email })
  res.cookies.set(TOKEN_NAME, token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}
