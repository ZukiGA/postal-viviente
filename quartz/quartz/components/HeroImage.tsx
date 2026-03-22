import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export default (() => {
  const HeroImage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const thumbnail = fileData.frontmatter?.thumbnail as string | undefined
    const title = fileData.frontmatter?.title as string
    
    // Only show on posts with thumbnail (skip index)
    if (!thumbnail || fileData.slug === "index") {
      return null
    }

    return (
      <div class="hero-image">
        <img src={thumbnail} alt={title} loading="eager" />
      </div>
    )
  }

  HeroImage.displayName = "HeroImage"
  return HeroImage
}) satisfies QuartzComponentConstructor
