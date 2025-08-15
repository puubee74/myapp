// src/app/api/upload/route.ts
import { NextResponse } from 'next/server'
import path from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'

export const runtime = 'nodejs' // fs хэрэгтэй

export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 415 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 })
  }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, name), bytes)

  return NextResponse.json({ url: `/uploads/${name}` })
}
