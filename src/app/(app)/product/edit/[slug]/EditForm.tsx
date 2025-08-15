// src/app/(app)/product/edit/[slug]/EditForm.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  slug: string;
  title: string;
  price: string;
  description: string;
};

type Props = { initial: Initial };

export default function EditForm({ initial }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initial.title);
  const [price, setPrice] = useState(initial.price);
  const [description, setDescription] = useState(initial.description);

  const [msg, setMsg] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const slugPreview = useMemo(() => {
    const base = title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return base || initial.slug;
  }, [title, initial.slug]);

  function onPriceChange(v: string) {
    const cleaned = v.replace(/,/g, ".").replace(/[^\d.]/g, "");
    setPrice(cleaned);
  }
  function onPriceBlur() {
    const num = Number(price);
    if (Number.isFinite(num)) setPrice(num.toFixed(2));
  }
  function handleReset() {
    setTitle(initial.title);
    setPrice(initial.price);
    setDescription(initial.description);
    setMsg("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const num = Number(price);
    if (!Number.isFinite(num) || num < 0) {
      setMsg("Үнэ 0-ээс их тоо байх ёстой.");
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/products/by-slug/${encodeURIComponent(initial.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, price: num.toFixed(2), description }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setMsg(data?.error || "Хадгалах үед алдаа гарлаа.");
      return;
    }

    const nextSlug = data?.slug ?? initial.slug;
    router.push(`/product/detail/${encodeURIComponent(nextSlug)}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl text-zinc-100">
      {/* Dark info banner */}
      <div className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm">
        Гарчиг өөрчлөгдвөл slug урьдчилан <span className="font-medium">/{slugPreview}</span> болж магадгүй.
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Гарчиг</label>
        <input
          className="w-full rounded-xl border border-white/15 bg-zinc-800 text-zinc-100 placeholder-zinc-500 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ж: iPhone 15 Pro"
          required
        />
        <p className="mt-1 text-xs text-zinc-400">Товч, ойлгомжтой нэр өгнө үү.</p>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Үнэ</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 select-none">₮</span>
          <input
            className="w-full rounded-xl border border-white/15 bg-zinc-800 text-zinc-100 placeholder-zinc-500 pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-white/20"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            onBlur={onPriceBlur}
            placeholder="0.00"
            inputMode="decimal"
            required
          />
        </div>
        <p className="mt-1 text-xs text-zinc-400">Жишээ нь: 1000.00.</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-200 mb-1">Тайлбар</label>
        <textarea
          className="w-full rounded-xl border border-white/15 bg-zinc-800 text-zinc-100 placeholder-zinc-500 px-3 py-2 min-h-[140px] outline-none focus:ring-2 focus:ring-white/20"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Бүтээгдэхүүний товч танилцуулга, онцлог..."
        />
        <div className="mt-2 text-xs text-zinc-300 flex gap-3">
          <span className="inline-block rounded-lg bg-white/10 px-2 py-0.5">Owner: Та</span>
          <span className="inline-block rounded-lg bg-white/10 px-2 py-0.5">Slug: {initial.slug}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 hover:bg-zinc-200 disabled:opacity-60"
          disabled={saving}
        >
          {saving && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          )}
          Хадгалах
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-white/15 px-4 py-2 text-zinc-200 hover:bg-white/10"
          disabled={saving}
        >
          Reset
        </button>

        <button
          type="button"
          onClick={() => router.push(`/product/detail/${encodeURIComponent(initial.slug)}`)}
          className="rounded-xl border border-white/15 px-4 py-2 text-zinc-200 hover:bg白/10"
          disabled={saving}
        >
          Цуцлах
        </button>

        {msg && <span className="text-red-400 text-sm">{msg}</span>}
      </div>
    </form>
  );
}
