import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // 1) await хэрэгтэй
  const a = await getAuth()
  if (!a) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  // 2) params.id шалгаж авах (заавал биш, гэхдээ найдвартай)
  const id = Number(params.id)
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const row = await prisma.product.findUnique({ where: { id } })
  if (!row || row.ownerId !== a.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(row)
}
