import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/journeyMap.inline"
import style from "./styles/journeyMap.scss"

export default (() => {
  const JourneyMap: QuartzComponent = ({ allFiles }: QuartzComponentProps) => {
    // Extract posts with coordinates from frontmatter
    const posts = allFiles
      .filter((f) => f.frontmatter?.coordinates && f.frontmatter?.title)
      .map((f) => ({
        title: f.frontmatter!.title as string,
        date: f.frontmatter!.date as string,
        location: (f.frontmatter!.location as string) || "",
        coordinates: f.frontmatter!.coordinates as [number, number],
        thumbnail: (f.frontmatter!.thumbnail as string) || "",
        slug: f.slug!,
        tags: (f.frontmatter!.tags as string[]) || [],
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return (
      <div class="journey-map-container">
        <div id="journey-map" data-posts={JSON.stringify(posts)}></div>
      </div>
    )
  }

  JourneyMap.css = style
  JourneyMap.afterDOMLoaded = script

  return JourneyMap
}) satisfies QuartzComponentConstructor
