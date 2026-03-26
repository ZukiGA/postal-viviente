import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default (() => {
  const TravelStats: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    const posts = allFiles
      .filter((f: QuartzPluginData) => f.slug !== "index" && f.frontmatter?.coordinates && !f.frontmatter?.draft)
      .sort((a: QuartzPluginData, b: QuartzPluginData) => {
        const da = new Date(a.frontmatter?.date as string).getTime()
        const db = new Date(b.frontmatter?.date as string).getTime()
        return da - db
      })

    if (posts.length === 0) return null

    // Calculate total distance
    let totalKm = 0
    // Add distance from Seattle (home base) to first post
    const SEATTLE = [47.6062, -122.3321]
    if (posts.length > 0) {
      const first = posts[0].frontmatter!.coordinates as [number, number]
      totalKm += haversineKm(SEATTLE[0], SEATTLE[1], first[0], first[1])
    }
    for (let i = 1; i < posts.length; i++) {
      const prev = posts[i - 1].frontmatter!.coordinates as [number, number]
      const curr = posts[i].frontmatter!.coordinates as [number, number]
      totalKm += haversineKm(prev[0], prev[1], curr[0], curr[1])
    }

    // Unique places
    const places = new Set(posts.map((p: QuartzPluginData) => p.frontmatter?.location as string))

    const stats = [
      { value: `${Math.round(totalKm).toLocaleString()} km`, label: "recorridos" },
      { value: `${posts.length}`, label: "historias" },
      { value: `${places.size}`, label: "lugares" },
    ]

    return (
      <div class="travel-stats">
        <div class="travel-stats-grid">
          {stats.map((s) => (
            <div class="travel-stat">
              <span class="travel-stat-value">{s.value}</span>
              <span class="travel-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  TravelStats.displayName = "TravelStats"
  return TravelStats
}) satisfies QuartzComponentConstructor
