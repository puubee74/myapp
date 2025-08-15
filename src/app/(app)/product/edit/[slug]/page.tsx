import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import EditForm from "./EditForm";

export default async function EditProduct({ params }: { params: { slug: string } }) {
  const auth = await getAuth();
  if (!auth) redirect("/login");

  const item = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!item || item.ownerId !== auth.id) notFound();

  return (
    <section
      className="
        rounded-2xl
        border border-white/12
        bg-gradient-to-b from-zinc-900 to-zinc-900/80
        text-zinc-100 shadow-sm
      "
    >
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 px-6 pt-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Засах: <span className="opacity-90">{item.title}</span>
        </h1>
        <Link
          href={`/product/detail/${item.slug}`}
          className="rounded-xl border border-white/15 px-3 py-1.5 text-sm hover:bg-white/10"
        >
          Буцах
        </Link>
      </div>

      {/* divider */}
      <div className="mx-6 my-4 h-px bg-white/10" />

      {/* form body */}
      <div className="px-6 pb-6">
        <EditForm
          initial={{
            slug: item.slug,
            title: item.title,
            price: item.price.toString(),
            description: item.description ?? "",
          }}
        />
      </div>
    </section>
  );
}
