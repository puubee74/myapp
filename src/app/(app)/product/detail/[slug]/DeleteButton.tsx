"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteButton({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onDelete() {
    if (!confirm("Энэ бүтээгдэхүүнийг устгах уу? Үйлдлийг буцаах боломжгүй.")) return
    setLoading(true)
    const res = await fetch(`/api/products/by-slug/${encodeURIComponent(slug)}`, { method: "DELETE" })
    setLoading(false)

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data?.error || "Delete failed")
      return
    }
    router.push("/product/list")
    router.refresh()
  }

  return (
    <button
      onClick={onDelete}
      disabled={loading}
      className="text-center rounded-xl border border-red-500/50 text-red-500 px-3 py-2 hover:bg-red-600 hover:text-white transition disabled:opacity-60"
      title="Delete"
    >
      {loading ? "Устгаж байна…" : "Устгах"}
    </button>
  )
}
