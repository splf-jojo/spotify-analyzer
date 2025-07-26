import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { fetchTopGenres, refreshSpotifyToken } from "@/lib/spotify";


interface PageProps {
  params: { user_id: string };
}

export default async function UserPage({ params }: PageProps) {
  const { user_id } = params;
  const user = await prisma.user.findUnique({
    where: { id: user_id },
    include: { accounts: true },
  });

  if (!user) {
    return (
      <main className="p-6 text-white bg-neutral-900 min-h-screen">
        <h1 className="text-2xl">Пользователь не найден</h1>
      </main>
    );
  }

  const account = user.accounts.find((a) => a.provider === "spotify");
  let genres: string[] = [];
  if (account?.access_token) {
    let token = account.access_token;
    if (account.expires_at && account.expires_at * 1000 < Date.now()) {
      try {
        token = await refreshSpotifyToken(account.id, account.refresh_token ?? "");
      } catch (e) {
        console.error(e);
      }
    }
    try {
      genres = await fetchTopGenres(token, "medium_term");=======
   
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <main className="p-6 text-white bg-neutral-900 min-h-screen space-y-4">
      <div className="flex items-center gap-4">
        {user.image && (
          <Image
            src={user.image}
            alt={user.name ?? "avatar"}
            width={64}
            height={64}
            className="rounded-full"
          />
        )}
        <h1 className="text-2xl">{user.name ?? "Unknown User"}</h1>
      </div>
      <div>
        <h2 className="text-xl mb-2">Любимые жанры</h2>
        {genres.length > 0 ? (
          <ul className="list-disc pl-6">
            {genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Нет данных</p>
        )}
      </div>
    </main>
  );
}
