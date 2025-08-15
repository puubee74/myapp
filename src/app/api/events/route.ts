// // src/app/api/events/route.ts
// import { NextResponse } from "next/server";
// import { mongoConnect, EventModel } from "@/lib/mongo";
// export const runtime = "nodejs";
// export async function POST() {
//   await mongoConnect();
//   const doc = await EventModel.create({ type: "ping", payload: { t: Date.now() } });
//   return NextResponse.json({ id: doc._id.toString() });
// }
import { NextResponse } from 'next/server'
import { prismaMongo } from '@/lib/prisma-mongo'
import { getAuth } from '@/lib/auth'

export const runtime = 'nodejs'  // Prisma Edge-д ажиллахгүй

export async function POST(req: Request) {
  const a = await getAuth()
  if (!a) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { type = 'custom', payload = {} } = await req.json().catch(() => ({}))

  const doc = await prismaMongo.event.create({
    data: { type, payload: { ...payload, userId: a.id } }
  })
  return NextResponse.json({ id: doc.id })
}

export async function GET() {
  const rows = await prismaMongo.event.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json(rows)
}
