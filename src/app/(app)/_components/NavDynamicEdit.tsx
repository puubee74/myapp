"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavDynamicEdit() {
  const pathname = usePathname();
  // /product/detail/[slug] эсвэл /product/edit/[slug] үед илрүүлнэ
  const m = pathname?.match(/^\/product\/(?:detail|edit)\/([^/?#]+)/);
  if (!m) return null;

  const slug = decodeURIComponent(m[1]);
  return (
    <Link
      href={`/product/edit/${slug}`}
      className="px-3 h-9 inline-flex items-center rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      Засах
    </Link>
  );
}
