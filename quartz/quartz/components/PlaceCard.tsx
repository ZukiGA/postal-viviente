import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

interface PlaceCardOptions {
  showLocationIcon?: boolean
}

const defaultOptions: PlaceCardOptions = {
  showLocationIcon: true,
}

export default ((opts?: Partial<PlaceCardOptions>) => {
  const options: PlaceCardOptions = { ...defaultOptions, ...opts }

  const PlaceCard: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const frontmatter = fileData.frontmatter
    
    // Only show on posts with location metadata
    if (!frontmatter?.location) {
      return null
    }

    const placeData = {
      location: frontmatter.location as string,
      distance: frontmatter.distance as string | undefined,
      weather: frontmatter.weather as string | undefined,
      wouldReturn: frontmatter.wouldReturn as boolean | string | undefined,
      activity: frontmatter.activity as string | undefined,
      departure: frontmatter.departure as string | undefined,
      companions: frontmatter.companions as string | undefined,
    }

    const formatWouldReturn = (value: boolean | string | undefined): string => {
      if (value === true || value === "true" || value === "Sí" || value === "Si") return "Sí"
      if (value === false || value === "false" || value === "No") return "No"
      return String(value || "—")
    }

    return (
      <div class="place-card">
        <h3 class="place-card-title">FICHA DEL LUGAR</h3>
        <div class="place-card-grid">
          <div class="place-card-col">
            {placeData.location && (
              <div class="place-card-item">
                <strong>Lugar:</strong> {placeData.location}
              </div>
            )}
            {placeData.distance && (
              <div class="place-card-item">
                <strong>Distancia:</strong> {placeData.distance}
              </div>
            )}
            <div class="place-card-item">
              <strong>Volvería:</strong> {formatWouldReturn(placeData.wouldReturn)}
            </div>
          </div>
          <div class="place-card-col">
            {placeData.activity && (
              <div class="place-card-item">
                <strong>Actividad:</strong> {placeData.activity}
              </div>
            )}
            {placeData.departure && (
              <div class="place-card-item">
                <strong>Salida:</strong> {placeData.departure}
              </div>
            )}
            {placeData.companions && (
              <div class="place-card-item">
                <strong>Con:</strong> {placeData.companions}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  PlaceCard.displayName = "PlaceCard"
  return PlaceCard
}) satisfies QuartzComponentConstructor
