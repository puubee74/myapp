// src/app/(app)/layout.tsx
import Link from "next/link";
import { getAuth } from "@/lib/auth";
import NavDynamicEdit from "./_components/NavDynamicEdit";     // ⬅️ нэмэв
import SideDynamicEdit from "./_components/SideDynamicEdit";   // ⬅️ нэмэв

export default async function AppLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  const auth = await getAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-900/60">
        <div className="max-w-6xl mx-auto h-14 px-4 flex items-center gap-3">
          <Link href="/product/list" className="flex items-center gap-2 font-semibold">
            <AppIcon />
            <span className="hidden sm:inline">
              {process.env.NEXT_PUBLIC_APP_NAME ?? "My Products"}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-4 hidden md:flex items-center gap-1">
            
            
          </nav>

          <div className="ml-auto" />

         

          {/* Auth button */}
          {auth ? (
            <form action="/login" method="post">
  <button type="submit" className="h-9 px-3 rounded-xl border">Гарах</button>
</form>

          ) : (
            <Link
              href="/login"
              className="ml-2 h-9 px-3 inline-flex items-center rounded-xl border border-black/10 dark:border-white/15 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid gap-6 md:grid-cols-[220px_1fr]">
        {/* Sidebar (md+) */}
        <aside className="hidden md:block">
          <div className="rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-3">
            <div className="text-xs uppercase text-gray-500 dark:text-zinc-400 mb-2 px-2">
              Navigation
            </div>
            <nav className="grid">
              <SideLink href="/product/list">Бүх бүтээгдэхүүн</SideLink>
              <SideLink href="/product/create">Бүтээгдэхүүн нэмэх</SideLink>
              <SideDynamicEdit /> {/* ⬅️ slug байвал энд “pgbab” */}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="relative">
          {children}
          {modal ?? null}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-white/10 py-6 text-center text-xs text-gray-500 dark:text-zinc-400">
        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME ?? "My Products"}
      </footer>
    </div>
  );
}

function TopNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 h-9 inline-flex items-center rounded-xl border border-transparent hover:border-black/10 dark:hover:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}

function SideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition"
    >
      {children}
    </Link>
  );
}

function AppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-black dark:text-white">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" opacity="0.08" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
