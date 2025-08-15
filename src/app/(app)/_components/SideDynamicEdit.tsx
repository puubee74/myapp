"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideDynamicEdit() {
  const pathname = usePathname();
  const m = pathname?.match(/^\/product\/(?:detail|edit)\/([^/?#]+)/);
  if (!m) return null;

  const slug = decodeURIComponent(m[1]);
  return (
    <Link
      href={`/product/edit/${slug}`}
      className="px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      Бүтээгдэхүүн засах
    </Link>
  );
}
