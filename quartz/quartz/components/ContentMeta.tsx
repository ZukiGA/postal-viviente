import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: false,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      // Add location if present
      const location = fileData.frontmatter?.location
      if (location) {
        segments.push(
          <span class="location-meta">
            📍 {location}
          </span>
        )
      }

      // Add rating if present
      const rating = fileData.frontmatter?.rating
      if (rating && typeof rating === 'number') {
        const stars = "★".repeat(rating) + "☆".repeat(5 - rating)
        segments.push(<span class="rating-meta">{stars}</span>)
      }

      const separated: (string | JSX.Element)[] = []
      segments.forEach((seg, i) => {
        if (i > 0) separated.push(<span class="meta-sep"> · </span>)
        separated.push(seg)
      })

      return (
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {separated}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
