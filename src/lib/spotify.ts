import { prisma } from "@/lib/prisma";
export async function fetchTopGenres(
  accessToken: string,
  timeRange: "short_term" | "medium_term" | "long_term"
) {
  const res = await fetch(
    `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch artists");
  }
  const data = await res.json();
  const counts: Record<string, number> = {};
  for (const artist of data.items as { genres: string[] }[]) {
    for (const genre of artist.genres as string[]) {
      counts[genre] = (counts[genre] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([g]) => g);
}

/**
 * Refresh Spotify access token using a stored refresh token.
 * Returns the new access token and updates the account in the database.
 */
export async function refreshSpotifyToken(
  accountId: string,
  refreshToken: string
) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.SPOTIFY_CLIENT_ID ?? "",
      client_secret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to refresh token");
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
  };
  await prisma.account.update({
    where: { id: accountId },
    data: {
      access_token: data.access_token,
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      refresh_token: data.refresh_token ?? refreshToken,
    },
  });
  return data.access_token;
}
