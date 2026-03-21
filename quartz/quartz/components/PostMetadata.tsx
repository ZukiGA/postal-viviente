import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PostMetadata: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const location = fileData.frontmatter?.location
  const rating = fileData.frontmatter?.rating
  
  if (!location && !rating) {
    return null
  }

  const renderStars = (count: number) => {
    return "★".repeat(count) + "☆".repeat(5 - count)
  }

  return (
    <div class={classNames(displayClass, "post-metadata")}>
      {location && (
        <div class="location">
          {location}
        </div>
      )}
      {rating && (
        <div class="rating">
          <span class="stars">{renderStars(rating)}</span>
        </div>
      )}
    </div>
  )
}

export default (() => PostMetadata) satisfies QuartzComponentConstructor
