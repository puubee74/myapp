// // src/app/api/products/by-slug/[slug]/route.ts
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { getAuth } from "@/lib/auth";
// import { slugify } from "@/lib/slug";

// export async function PUT(req: Request, { params }: { params: { slug: string } }) {
//   const a = await getAuth();
//   if (!a) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

//   const old = await prisma.product.findUnique({ where: { slug: params.slug } });
//   if (!old || old.ownerId !== a.id) {
//     return NextResponse.json({ error: "Not found" }, { status: 404 });
//   }

//   const { title, price, description } = await req.json();

//   if (!title || price === undefined || price === null) {
//     return NextResponse.json({ error: "Title & price required" }, { status: 400 });
//   }

//   const numPrice = Number(price);
//   if (!Number.isFinite(numPrice) || numPrice < 0) {
//     return NextResponse.json({ error: "Invalid price" }, { status: 400 });
//   }

//   // Title өөрчлөгдвөл slug-ийг шинэчилнэ
//   const newSlug = title === old.title ? old.slug : slugify(title);

//   try {
//     const updated = await prisma.product.update({
//       where: { id: old.id },
//       data: {
//         title,
//         slug: newSlug,
//         description: description ?? null,
//         price: numPrice.toFixed(2) as any, // Prisma Decimal
//       },
//       select: { id: true, slug: true },
//     });

//     return NextResponse.json(updated);
//   } catch (e: any) {
//     // unique slug давхцах
//     if (e?.code === "P2002") {
//       return NextResponse.json({ error: "Title/slug already exists" }, { status: 409 });
//     }
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
// export async function DELETE(_req: Request, { params }: { params: { slug: string } }) {
//   const a = await getAuth()
//   if (!a) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

//   const row = await prisma.product.findUnique({ where: { slug: params.slug } })
//   if (!row || row.ownerId !== a.id) {
//     return NextResponse.json({ error: 'Not found' }, { status: 404 })
//   }

//   await prisma.product.delete({ where: { id: row.id } })
//   return NextResponse.json({ ok: true })
// }
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { prismaMongo } from '@/lib/prisma-mongo'
import { getAuth } from '@/lib/auth'
import { slugify } from '@/lib/slug'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const a = await getAuth()
  if (!a) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { title, price, description, imageUrl } = body
  if (!title || price == null) return NextResponse.json({ error: 'Title & price required' }, { status: 400 })

  const num = Number(price)
  if (!Number.isFinite(num) || num < 0) return NextResponse.json({ error: 'Invalid price' }, { status: 400 })

  const slug = slugify(String(title))
  const safePrice = num.toFixed(2)

  try {
    // 1) MySQL дээр үндсэн бичилт
    const created = await prisma.product.create({
      data: {
        title,
        slug,
        description: description ?? null,
        price: safePrice as any,
        imageUrl: imageUrl ?? null,
        ownerId: a.id,
      },
      select: { id: true, slug: true, title: true },
    })

    // 2) Mongo (Prisma) дээр эвент — алдааг тусад нь барина
    prismaMongo.event.create({ /* ... */ })
  .catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Mongo (Prisma) write failed:', msg, err)
  })

    return NextResponse.json(created)
  } catch (e: any) {
    if (e?.code === 'P2002') return NextResponse.json({ error: 'Title/slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
