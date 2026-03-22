import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import { resolveRelative } from "../util/path"

const categories = [
  { label: "Cafés", slug: "tags/cafes" },
  { label: "Caminatas", slug: "tags/caminatas" },
  { label: "Ciudades", slug: "tags/ciudades" },
  { label: "Viajes", slug: "tags/viajes" },
  { label: "Momentos", slug: "tags/momentos" },
]

export default (() => {
  const IndexHero: QuartzComponent = ({ allFiles, fileData, cfg }: QuartzComponentProps) => {
    if (fileData.slug !== "index") return null

    // Get the latest post's thumbnail
    const posts = allFiles
      .filter((f: QuartzPluginData) => f.slug !== "index" && f.frontmatter?.draft !== true)
      .sort(byDateAndAlphabetical(cfg))

    const latestPost = posts[0]
    const thumbnail = latestPost?.frontmatter?.thumbnail as string | undefined

    return (
      <div class="index-hero">
        <p class="index-tagline">Un archivo visual de lo que no quiero olvidar.</p>

        {thumbnail && latestPost && (
          <a href={resolveRelative(fileData.slug!, latestPost.slug!)} class="index-hero-image-link internal">
            <div class="index-hero-image">
              <img src={thumbnail} alt={latestPost.frontmatter?.title as string} loading="eager" />
            </div>
          </a>
        )}

        <nav class="index-categories">
          {categories.map((cat, i) => (
            <>
              {i > 0 && <span class="cat-sep"> · </span>}
              <a href={resolveRelative(fileData.slug!, cat.slug)} class="internal cat-link">
                {cat.label}
              </a>
            </>
          ))}
        </nav>
      </div>
    )
  }

  IndexHero.displayName = "IndexHero"
  return IndexHero
}) satisfies QuartzComponentConstructor
