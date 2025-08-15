// src/app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "My Products";

  return (
    <div className="relative min-h-dvh bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-dvh max-w-6xl md:grid-cols-2">
        {/* Left hero (hidden on small screens) */}
        <aside className="hidden md:flex flex-col justify-center gap-6 p-8 pr-4">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-lg">
            <LogoIcon />
            <span>{appName}</span>
          </Link>

          <h1 className="text-3xl font-bold leading-tight">
            Тавтай морил 👋
          </h1>
          <p className="text-gray-600 dark:text-zinc-400">
            Өөрийн бүтээгдэхүүнүүдээ бүртгэж, удирдаж, дэлгэрэнгүй мэдээллийг аюулгүй орчинд хялбараар менеж хийх.
          </p>

          <ul className="space-y-2 text-sm text-gray-600 dark:text-zinc-400">
            <li>• Нэвтэрсний дараа зөвхөн өөрийн бүтээгдэхүүн харагдана</li>
            <li>• Card/Table хооронд амархан сольж харна</li>
            <li>• Дэлгэрэнгүйг жагсаалтаас Modal байдлаар нээх боломжтой</li>
          </ul>
        </aside>

        {/* Right auth card */}
        <main className="flex items-center justify-center p-6 md:p-8">
          <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-6 shadow-sm">
            {/* Brand (mobile) */}
            <div className="mb-4 flex items-center justify-center md:hidden">
              <Link href="/" className="inline-flex items-center gap-2 font-semibold">
                <LogoIcon />
                <span>{appName}</span>
              </Link>
            </div>

            {/* Slot: Login/Signup form */}
            {children}

            {/* Helpful links */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-zinc-400">
              <Link href="/login" className="hover:underline">Нэвтрэх</Link>
              <Link href="/signup" className="hover:underline">Бүртгүүлэх</Link>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-black/5 dark:border-white/10 py-6 text-center text-xs text-gray-500 dark:text-zinc-400">
        © {new Date().getFullYear()} {appName}
      </footer>
    </div>
  );
}

function LogoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="text-black dark:text-white">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" opacity="0.08" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
