import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'


export async function POST(req: Request) {
const { email, password, repassword } = await req.json()
if (!email || !password || !repassword) return NextResponse.json({ error: 'Бүх талбарыг бөглөнө үү' }, { status: 400 })
if (password !== repassword) return NextResponse.json({ error: 'Нууц үг таарахгүй байна' }, { status: 400 })
const exists = await prisma.user.findUnique({ where: { email } })
if (exists) return NextResponse.json({ error: 'Email in use' }, { status: 409 })
const hash = await bcrypt.hash(password, 10)
await prisma.user.create({ data: { email, password: hash } })
return NextResponse.json({ ok: true })
}