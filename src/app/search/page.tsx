import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface PageProps {
  searchParams?: { q?: string };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams ?? {};
  const users = q
    ? await prisma.user.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        take: 20,
        select: { id: true, name: true },
      })
    : [];
  return (
    <main className="p-6 text-white bg-neutral-900 min-h-screen space-y-4">
      <form className="space-x-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Имя пользователя"
          className="px-2 py-1 rounded text-black"
        />
        <button type="submit" className="px-2 py-1 bg-green-600 rounded">
          Найти
        </button>
      </form>
      <ul className="list-disc pl-6 space-y-1">
        {users.map((u) => (
          <li key={u.id}>
            <Link className="text-green-400 hover:underline" href={`/${u.id}`}>{u.name}</Link>
          </li>
        ))}
        {q && users.length === 0 && <li className="text-gray-400">Ничего не найдено</li>}
      </ul>
    </main>
  );
}
