'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function onPriceBlur() {
    const num = Number(price)
    if (Number.isFinite(num)) setPrice(num.toFixed(2))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')

    if (!title || !price) {
      setMsg('Title & price required'); return
    }

    setSaving(true)

    // 1) Хэрэв зураг сонгосон бол эхлээд upload хийнэ
    let imageUrl: string | undefined
    if (file) {
      const fd = new FormData()
      fd.append('file', file)
      const up = await fetch('/api/upload', { method: 'POST', body: fd })
      const upData = await up.json().catch(() => ({}))
      if (!up.ok) {
        setSaving(false)
        setMsg(upData?.error || 'Image upload failed')
        return
      }
      imageUrl = upData.url as string
    }

    // 2) Дараа нь бүтээгдэхүүнээ үүсгэнэ
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price, description, imageUrl })
    })
    const data = await res.json().catch(() => ({}))

    setSaving(false)
    if (!res.ok) {
      setMsg(data?.error || 'Failed to create')
      return
    }

    router.push('/product/list')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
      {/* Image picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Зураг</label>
        <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
          <label className="relative border-2 border-dashed border-black/10 rounded-xl p-4 cursor-pointer hover:bg-black/5">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <div className="text-sm text-gray-600">
              {preview ? 'Зураг солих' : 'Зураг сонгох/чирж оруулах'}
            </div>
          </label>

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="aspect-video w-full rounded-xl object-cover border border-black/10"
            />
          ) : (
            <div className="aspect-video w-full rounded-xl border border-black/10 bg-gray-50 grid place-items-center text-sm text-gray-400">
              Урьдчилсан харагдац
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">PNG/JPG, 5MB-с бага.</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Гарчиг</label>
        <input
          className="w-full border rounded-xl p-2 outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Ж: iPhone 15 Pro"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Үнэ</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 select-none">₮</span>
          <input
            className="w-full border rounded-xl p-2 pl-8 outline-none focus:ring-2 focus:ring-black/10"
            placeholder="0.00"
            value={price}
            onChange={e=>setPrice(e.target.value.replace(/,/g,'.').replace(/[^\d.]/g,''))}
            onBlur={onPriceBlur}
            inputMode="decimal"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Тайлбар</label>
        <textarea
          className="w-full border rounded-xl p-2 min-h-[120px] outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Бүтээгдэхүүний товч тайлбар..."
          value={description}
          onChange={e=>setDescription(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="bg-black text-white rounded-xl px-4 py-2 disabled:opacity-60" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        {msg && <p className="text-red-600 text-sm">{msg}</p>}
      </div>
    </form>
  )
}
