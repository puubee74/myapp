import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'


export async function GET() {
const a = getAuth()
if (!a) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
return NextResponse.json(a)
}