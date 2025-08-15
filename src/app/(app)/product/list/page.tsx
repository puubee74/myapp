'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Product = { id: number; title: string; slug: string; price: string }

function formatMNT(value: string | number) {
  const n = typeof value === 'string' ? Number(value) : value
  if (!Number.isFinite(n)) return '₮ 0'
  return new Intl.NumberFormat('mn-MN', {
    style: 'currency',
    currency: 'MNT',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function ProductListPage() {
  const [view, setView] = useState<'card' | 'table'>('card')
  const [items, setItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/products/mine', { cache: 'no-store' })
        if (res.ok) setItems(await res.json())
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView('card')}
          className={`px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/15 ${
            view === 'card' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          Card
        </button>
        <button
          onClick={() => setView('table')}
          className={`px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/15 ${
            view === 'table' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          Table
        </button>
      </div>

      {view === 'card' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <Link
              key={p.id}
              href={`/product/detail/${p.slug}`}
              className="block rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900 p-4 hover:shadow-sm hover:-translate-y-0.5 transition"
            >
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-500 dark:text-zinc-400">{formatMNT(p.price)}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/15 bg-white dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed">
              <thead className="sticky top-0 z-10 bg-gray-50/80 dark:bg-zinc-800/70 backdrop-blur border-b border-black/10 dark:border-white/10">
                <tr>
                  <Th className="w-[55%]">Title</Th>
                  <Th className="w-[25%]">Price</Th>
                  <Th className="w-[20%] text-right pr-4">Action</Th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                )}

                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-sm text-gray-500 dark:text-zinc-400">
                      Одоогоор бүтээгдэхүүн алга. <Link href="/product/create" className="underline">Шинээр нэмэх</Link>
                    </td>
                  </tr>
                )}

                {!loading &&
                  items.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`group border-t border-black/5 dark:border-white/5 ${
                        idx % 2 ? 'bg-gray-50/60 dark:bg-white/5' : ''
                      } hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}
                    >
                      <td className="p-3 align-middle">
                        <div className="font-medium text-gray-900 dark:text-zinc-100">{p.title}</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400">/{p.slug}</div>
                      </td>
                      <td className="p-3 align-middle">
                        <div className="text-gray-900 dark:text-zinc-100">{formatMNT(p.price)}</div>
                      </td>
                      <td className="p-3 align-middle">
                        <div className="flex justify-end">
                          <Link
                            href={`/product/detail/${p.slug}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-black/10 dark:border-white/15 px-3 py-1.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                          >
                            View
                            <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70">
                              <path d="M8 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* small presentational helpers */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-zinc-400 p-3 ${className}`}>
      {children}
    </th>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-t border-black/5 dark:border-white/5 animate-pulse">
      <td className="p-3">
        <div className="h-3.5 w-40 rounded bg-black/10 dark:bg-white/10" />
      </td>
      <td className="p-3">
        <div className="h-3.5 w-24 rounded bg-black/10 dark:bg-white/10" />
      </td>
      <td className="p-3">
        <div className="ml-auto h-8 w-16 rounded-xl bg-black/10 dark:bg-white/10" />
      </td>
    </tr>
  )
}
