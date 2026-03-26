import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { resolveRelative } from "../util/path"

const categoryChips = [
  { label: "Caminatas", slug: "tags/caminatas" },
  { label: "Cafés", slug: "tags/cafes" },
  { label: "Road Trips", slug: "tags/road-trip" },
  { label: "Ciudades", slug: "tags/ciudades" },
  { label: "Viajes", slug: "tags/viajes" },
  { label: "Reflexiones", slug: "tags/reflexiones" },
]

export default (() => {
  const ExploreSection: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    // Extract unique locations from all posts
    const places = new Map<string, string>()
    allFiles
      .filter((f: QuartzPluginData) => f.slug !== "index" && f.frontmatter?.draft !== true)
      .forEach((f: QuartzPluginData) => {
        const location = f.frontmatter?.location as string | undefined
        if (location && f.slug) {
          const parts = location.split(",")
          const label = parts[0].trim()
          places.set(label, f.slug)
        }
      })

    const placeList = Array.from(places.entries())

    return (
      <div class="explore-sections">
        <section class="explore-by-category">
          <h2>Explorar por categoría</h2>
          <div class="explore-chips">
            {categoryChips.map((cat) => (
              <a
                href={resolveRelative(fileData.slug!, cat.slug)}
                class="internal explore-chip"
              >
                {cat.label}
              </a>
            ))}
          </div>
        </section>

        {placeList.length > 0 && (
          <section class="explore-by-place">
            <h2>Explorar por lugar</h2>
            <div class="explore-chips">
              {placeList.map(([label, slug]) => (
                <a href={resolveRelative(fileData.slug!, slug)} class="internal explore-chip explore-chip-place">
                  {label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    )
  }

  ExploreSection.displayName = "ExploreSection"
  return ExploreSection
}) satisfies QuartzComponentConstructor
