import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchTopGenres } from '@/lib/spotify'

export default async function Favorites() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.accessToken) {
    return (
      <main className="p-6 text-white bg-neutral-900 min-h-screen">
        <p>Необходимо войти в систему.</p>
      </main>
    )
  }
  const token = session.user.accessToken as string
  const [short, medium, long] = await Promise.all([
    fetchTopGenres(token, 'short_term'),
    fetchTopGenres(token, 'medium_term'),
    fetchTopGenres(token, 'long_term'),
  ])
  const groups = [
    { title: '3 месяца', data: short },
    { title: '6 месяцев', data: medium },
    { title: 'За все время', data: long },
  ]
  return (
    <main className="p-6 text-white bg-neutral-900 min-h-screen space-y-6">
      <h1 className="text-2xl">Любимые жанры</h1>
      {groups.map(group => (
        <div key={group.title}>
          <h2 className="text-xl mb-2">{group.title}</h2>
          <ul className="list-disc pl-6">
            {group.data.map(g => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  )
}
