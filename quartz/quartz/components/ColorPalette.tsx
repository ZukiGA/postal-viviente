import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const ColorPalette: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const palette = fileData.frontmatter?.palette as string[] | undefined
    if (!palette || palette.length === 0) return null

    return (
      <div class="color-palette">
        <div class="palette-bar">
          {palette.map((color) => (
            <div class="palette-swatch" style={`background-color: ${color}`} title={color}></div>
          ))}
        </div>
      </div>
    )
  }

  ColorPalette.displayName = "ColorPalette"
  return ColorPalette
}) satisfies QuartzComponentConstructor
