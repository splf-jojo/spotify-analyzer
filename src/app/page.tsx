import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-6 text-white bg-neutral-900 min-h-screen">
      <h1 className="text-2xl mb-4">Добро пожаловать в Spotify Analyzer</h1>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <Link className="text-green-400 hover:underline" href="/favorites">
            Favorites
          </Link>
        </li>
        <li>
          <Link className="text-green-400 hover:underline" href="/labels">
            Labels
          </Link>
        </li>
      </ul>
    </main>
  )
}
