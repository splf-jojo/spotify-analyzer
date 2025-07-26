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
  for (const artist of data.items as any[]) {
    for (const genre of artist.genres as string[]) {
      counts[genre] = (counts[genre] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([g]) => g);
}
