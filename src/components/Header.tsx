'use client'

import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-neutral-900 text-white">
      <div className="text-xl font-bold">
        <Link href="/">Spotify Analyzer</Link>
      </div>
      {session ? (
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <Link href={`/${session.user.id}`}>

              <Image src={session.user.image} alt="avatar" width={32} height={32} className="rounded-full" />
            </Link>
          )}
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()} className="text-sm text-gray-300 hover:underline">
            Sign out
          </button>
        </div>
      ) : (
        <button onClick={() => signIn('spotify')} className="text-sm hover:underline">
          Sign in
        </button>
      )}
    </header>
  )
}
