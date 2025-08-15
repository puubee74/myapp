import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export async function POST(req: Request) {
  const a = await getAuth()
  if (!a) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, price, description, imageUrl } = body ?? {}

  if (!title || price === undefined || price === null) {
    return NextResponse.json({ error: 'Title & price required' }, { status: 400 })
  }

  const num = Number(price)
  if (!Number.isFinite(num) || num < 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 })
  }

  const slug = slugify(String(title))
  const safePrice = num.toFixed(2)

  try {
    const created = await prisma.product.create({
      data: {
        title: String(title),
        slug,
        description: description ? String(description) : null,
        price: safePrice as any,     // Prisma Decimal OK with string
        imageUrl: imageUrl ? String(imageUrl) : null, // <-- зөвхөн талбар байгаа тохиолдолд
        ownerId: a.id,
      },
      select: { id: true, slug: true },
    })
    return NextResponse.json(created)
  } catch (e: any) {
    // DEV үед консольд тодорхой шалтгааныг хэвлээд, хариуд кодыг үзүүлнэ
    console.error('POST /api/products error:', e)
    if (e?.code === 'P2002') {
      return NextResponse.json({ error: 'Title/slug already exists', code: e.code }, { status: 409 })
    }
    if (e?.code === 'P2009' || e?.message?.includes('Unknown arg')) {
      return NextResponse.json({ error: 'Schema mismatch (check imageUrl column)', code: e.code }, { status: 500 })
    }
    return NextResponse.json({ error: 'Server error', code: e?.code ?? 'UNKNOWN' }, { status: 500 })
  }
}
