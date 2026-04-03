import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/postCatalog.scss"
import { Date, getDate } from "./Date"
import { classNames } from "../util/lang"

export default (() => {
  const PostCatalog: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const pages = allFiles
      .filter((f) => f.slug !== "index" && f.slug !== "catalogo" && f.frontmatter?.draft !== true)
      .sort(byDateAndAlphabetical(cfg))

    const getThumbnail = (page: typeof pages[0]): string | null => {
      if (page.frontmatter?.thumbnail) {
        return page.frontmatter.thumbnail as string
      }
      const gallery = page.frontmatter?.gallery
      if (gallery && Array.isArray(gallery) && gallery.length > 0) {
        return `/static/images/${gallery[gallery.length - 1]}`
      }
      const content = page.text
      if (!content) return null
      const imgMatches = content.match(/!\[.*?\]\((.*?)\)/g)
      if (!imgMatches || imgMatches.length === 0) return null
      const lastMatch = imgMatches[imgMatches.length - 1]
      const urlMatch = lastMatch.match(/!\[.*?\]\((.*?)\)/)
      return urlMatch ? urlMatch[1] : null
    }

    return (
      <div class={classNames(displayClass, "post-catalog")}>
        <p class="catalog-count">{pages.length} entradas</p>
        <div class="catalog-grid">
          {pages.map((page) => {
            const title = page.frontmatter?.title ?? page.slug
            const thumbnail = getThumbnail(page)
            const location = page.frontmatter?.location as string | undefined

            return (
              <div class="catalog-card">
                {thumbnail && (
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal catalog-card-image-link">
                    <img src={thumbnail} alt={title} class="catalog-card-thumb" loading="lazy" />
                  </a>
                )}
                <div class="catalog-card-info">
                  <h3 class="catalog-card-title">
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>
                  {page.dates && (
                    <p class="catalog-card-date">
                      <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                    </p>
                  )}
                  {location && (
                    <p class="catalog-card-location">{location}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  PostCatalog.css = style
  return PostCatalog
}) satisfies QuartzComponentConstructor
