document.addEventListener("nav", () => {
  const toggle = document.querySelector(".postcard-toggle") as HTMLButtonElement
  const overlay = document.querySelector(".postcard-overlay") as HTMLElement
  if (!toggle || !overlay) return

  const data = overlay.dataset
  const bg = overlay.querySelector(".postcard-bg") as HTMLImageElement
  const title = overlay.querySelector(".postcard-title") as HTMLElement
  const location = overlay.querySelector(".postcard-location") as HTMLElement
  const date = overlay.querySelector(".postcard-date") as HTMLElement
  const paletteEl = overlay.querySelector(".postcard-palette") as HTMLElement
  const downloadBtn = overlay.querySelector(".postcard-download") as HTMLButtonElement
  const closeBtn = overlay.querySelector(".postcard-close") as HTMLButtonElement

  // Clone and replace to remove stale listeners
  const newToggle = toggle.cloneNode(true) as HTMLButtonElement
  toggle.parentNode?.replaceChild(newToggle, toggle)
  const newDownload = downloadBtn.cloneNode(true) as HTMLButtonElement
  downloadBtn.parentNode?.replaceChild(newDownload, downloadBtn)
  const newClose = closeBtn.cloneNode(true) as HTMLButtonElement
  closeBtn.parentNode?.replaceChild(newClose, closeBtn)

  newToggle.addEventListener("click", () => {
    bg.src = data.thumbnail || ""
    title.textContent = data.title || ""
    location.textContent = `📍 ${data.location || ""}`
    date.textContent = data.date || ""

    const palette = JSON.parse(data.palette || "[]")
    paletteEl.innerHTML = palette
      .map((c: string) => `<span style="background:${c};width:20px;height:8px;border-radius:2px;display:inline-block"></span>`)
      .join("")

    overlay.classList.add("active")
  })

  newClose.addEventListener("click", () => overlay.classList.remove("active"))
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active")
  })

  newDownload.addEventListener("click", () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = 1200
    canvas.height = 630

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = data.thumbnail || ""

    img.onerror = () => {
      // Fallback: try without CORS
      const img2 = new Image()
      img2.src = data.thumbnail || ""
      img2.onload = () => drawPostcard(canvas, ctx, img2, data)
      img2.onerror = () => alert("No se pudo cargar la imagen para la postal.")
    }

    img.onload = () => drawPostcard(canvas, ctx, img, data)
  })
})

function drawPostcard(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  data: DOMStringMap,
) {
  // Draw image covering full canvas
  const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
  const x = (canvas.width - img.width * scale) / 2
  const y = (canvas.height - img.height * scale) / 2
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

  // Dark gradient overlay
  const grad = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height)
  grad.addColorStop(0, "rgba(0,0,0,0)")
  grad.addColorStop(1, "rgba(0,0,0,0.75)")
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Title
  ctx.fillStyle = "#fff"
  ctx.font = "bold 48px Inter, system-ui, sans-serif"
  ctx.fillText(data.title || "", 60, canvas.height - 140)

  // Location + date (no emoji — use text only for cross-browser compat)
  ctx.font = "24px Inter, system-ui, sans-serif"
  ctx.fillStyle = "rgba(255,255,255,0.8)"
  const locText = data.location || ""
  const dateText = data.date || ""
  ctx.fillText(`${locText}  ·  ${dateText}`, 60, canvas.height - 90)

  // Brand
  ctx.font = "16px Inter, system-ui, sans-serif"
  ctx.fillStyle = "rgba(255,255,255,0.5)"
  ctx.fillText("postalviviente.com", 60, canvas.height - 40)

  // Palette bar
  const palette = JSON.parse(data.palette || "[]")
  palette.forEach((c: string, i: number) => {
    ctx.fillStyle = c
    ctx.fillRect(canvas.width - 60 - (palette.length - i) * 28, canvas.height - 55, 24, 12)
  })

  // Download
  try {
    const link = document.createElement("a")
    link.download = `postal-${(data.title || "viviente").toLowerCase().replace(/\s+/g, "-")}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  } catch {
    alert("No se pudo generar la postal (CORS). Intenta hacer screenshot.")
  }
}
