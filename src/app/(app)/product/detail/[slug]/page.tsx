// src/app/(app)/product/detail/[slug]/page.tsx
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getAuth } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Image from "next/image"
import DeleteButton from "./DeleteButton"

function formatMNT(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value
  if (!Number.isFinite(n)) return "₮ 0"
  return new Intl.NumberFormat("mn-MN", {
    style: "currency",
    currency: "MNT",
    maximumFractionDigits: 0,
  }).format(n)
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const auth = await getAuth()
  if (!auth) redirect("/login")

  const item = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!item || item.ownerId !== auth.id) notFound()

  const priceText = formatMNT(item.price.toString())

  return (
    <div className="space-y-4">
      {/* Breadcrumb + quick actions */}
      <div className="flex items-center justify-between gap-2 text-sm">
        <nav className="text-gray-500">
          <Link href="/product/list" className="hover:underline">Products</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-400">detail</span>
          <span className="mx-1">/</span>
          <span className="text-gray-300 line-clamp-1">{item.title}</span>
        </nav>

        
      </div>

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Left: content card */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
          {/* Hero image (with graceful fallback) */}
          <div className="relative w-full aspect-[16/9]">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 640px, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-fuchsia-200/40 to-sky-200/40 dark:from-fuchsia-500/10 dark:to-sky-500/10" />
            )}
          </div>

          <div className="p-6">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {item.title}
            </h1>

            <p className="mt-2 text-gray-600 dark:text-zinc-300">
              {item.description || "No description provided."}
            </p>

            {/* badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 dark:bg-white/10 px-2.5 py-1 text-xs text-gray-700 dark:text-zinc-200 flex items-center gap-1">
                <SlugIcon /> {item.slug}
              </span>
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                Owner: you
              </span>
            </div>

            {/* Mobile actions */}
            <div className="mt-4 flex sm:hidden gap-2">
              <Link
                href={`/product/edit/${item.slug}`}
                className="flex-1 text-center rounded-xl border border-black/10 dark:border-white/15 px-3 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
              >
                Засах
              </Link>
              <Link
                href="/product/list"
                className="flex-1 text-center rounded-xl border border-black/10 dark:border-white/15 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                Буцах
              </Link>
            </div>
          </div>
        </div>

        {/* Right: sticky price & meta */}
        <aside className="md:sticky md:top-20 md:self-start space-y-4">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <div className="text-sm uppercase text-gray-500 dark:text-zinc-400">Үнэ</div>
            <div className="mt-2 text-3xl font-extrabold">{priceText}</div>

            <div className="mt-4 grid grid-cols-2 gap-2">
  <DeleteButton slug={item.slug} />
  <Link
    href="/product/list"
    className="text-center rounded-xl border border-black/10 dark:border-white/15 px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 transition"
  >
    Буцах
  </Link>
</div>
          </div>

          <div className="grid gap-3">
            <MetaCard label="Үүсгэсэн">{item.createdAt.toLocaleString("mn-MN")}</MetaCard>
            <MetaCard label="Өөрчилсөн">{item.updatedAt.toLocaleString("mn-MN")}</MetaCard>
            
          </div>
        </aside>
      </div>
    </div>
  )
}

/** Small presentational pieces */
function MetaCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-4">
      <div className="text-xs uppercase text-gray-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-sm text-gray-900 dark:text-zinc-100">{children}</div>
    </div>
  )
}

function SlugIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70">
      <path d="M7 7h10v10H7z" fill="currentColor" opacity="0.15" />
      <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}
