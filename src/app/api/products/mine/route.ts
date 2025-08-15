// app/api/products/mine/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'

export async function GET() {
  const a = await getAuth()            // <-- await хэрэгтэй
  if (!a) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
  }

  const rows = await prisma.product.findMany({
    where: { ownerId: a.id },          // одоо a.id OK
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, slug: true, price: true }
  })

  return NextResponse.json(rows)
}
