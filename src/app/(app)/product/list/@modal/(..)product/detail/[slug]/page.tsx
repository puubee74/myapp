import { prisma } from '@/lib/prisma'
import { getAuth } from '@/lib/auth'
import Link from 'next/link'

export default async function ProductDetailModal({ params }: { params: { slug: string } }) {
  const auth = await getAuth() // <-- await
  if (!auth) return null

  const item = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!item || item.ownerId !== auth.id) return null

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{item.title}</h2>
          <Link href="/product/list" className="text-gray-500">✕</Link>
        </div>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <div className="font-semibold">₮ {item.price.toString()}</div>
      </div>
    </div>
  )
}
