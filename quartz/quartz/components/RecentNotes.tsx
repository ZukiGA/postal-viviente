import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/recentNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"

interface Options {
  title?: string
  limit: number
  linkToMore: SimpleSlug | false
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showTags: true,
  filter: (f) => f.slug !== "index" && f.frontmatter?.draft !== true,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RecentNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const pages = allFiles.filter(opts.filter).sort(opts.sort)
    const remaining = Math.max(0, pages.length - opts.limit)
    
    // Extract thumbnail from frontmatter or fallback to text parsing
    const getThumbnail = (page: QuartzPluginData): string | null => {
      // Priority 1: Explicit thumbnail in frontmatter
      if (page.frontmatter?.thumbnail) {
        return page.frontmatter.thumbnail as string
      }
      
      // Priority 2: Last image from gallery frontmatter
      const gallery = page.frontmatter?.gallery
      if (gallery && Array.isArray(gallery) && gallery.length > 0) {
        const lastImage = gallery[gallery.length - 1]
        return `/static/images/${lastImage}`
      }
      
      // Priority 3: Extract from text content (fallback)
      const content = page.text
      if (!content) return null
      const imgMatches = content.match(/!\[.*?\]\((.*?)\)/g)
      if (!imgMatches || imgMatches.length === 0) return null
      const lastMatch = imgMatches[imgMatches.length - 1]
      const urlMatch = lastMatch.match(/!\[.*?\]\((.*?)\)/)
      return urlMatch ? urlMatch[1] : null
    }
    
    return (
      <div class={classNames(displayClass, "recent-notes")}>
        <h2 class="recent-notes-title">Notas recientes</h2>
        <div class="recent-grid">
          {pages.slice(0, opts.limit).map((page) => {
            const title = page.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
            const thumbnail = getThumbnail(page)

            return (
              <div class="recent-card">
                {thumbnail && (
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal recent-card-image-link">
                    <img src={thumbnail} alt={title} class="recent-card-thumb" loading="lazy" />
                  </a>
                )}
                <div class="recent-card-info">
                  <h3 class="recent-card-title">
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>
                  {page.dates && (
                    <p class="recent-card-date">
                      <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <p class="recent-notes-see-all">
          <a href={resolveRelative(fileData.slug!, "catalogo" as SimpleSlug)} class="internal">
            Ver todo →
          </a>
        </p>
      </div>
    )
  }

  RecentNotes.css = style
  return RecentNotes
}) satisfies QuartzComponentConstructor
