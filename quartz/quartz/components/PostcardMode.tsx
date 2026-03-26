import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/postcard.inline"
import style from "./styles/postcard.scss"

export default (() => {
  const PostcardMode: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const fm = fileData.frontmatter
    if (!fm?.thumbnail || !fm?.title || !fm?.location) return null

    const date = fm.date
      ? new Date(fm.date as string + "T12:00:00").toLocaleDateString("es-MX", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : ""

    const palette = (fm.palette as string[]) || []

    return (
      <div class="postcard-wrapper">
        <button class="postcard-toggle" aria-label="Ver como postal">
          📮 Ver como postal
        </button>
        <div
          class="postcard-overlay"
          data-thumbnail={fm.thumbnail as string}
          data-title={fm.title as string}
          data-location={fm.location as string}
          data-date={date}
          data-palette={JSON.stringify(palette)}
        >
          <div class="postcard-card">
            <img class="postcard-bg" alt="" />
            <div class="postcard-content">
              <div class="postcard-stamp">✈</div>
              <h3 class="postcard-title"></h3>
              <p class="postcard-location"></p>
              <p class="postcard-date"></p>
              <div class="postcard-palette"></div>
              <div class="postcard-brand">postalviviente.com</div>
            </div>
          </div>
          <div class="postcard-actions">
            <button class="postcard-download">⬇ Descargar</button>
            <button class="postcard-close">✕ Cerrar</button>
          </div>
        </div>
      </div>
    )
  }

  PostcardMode.css = style
  PostcardMode.afterDOMLoaded = script

  return PostcardMode
}) satisfies QuartzComponentConstructor
