// Load Leaflet dynamically — no API key needed
interface MapPost {
  title: string
  date: string
  location: string
  coordinates: [number, number]
  thumbnail: string
  slug: string
  tags: string[]
}

async function loadLeaflet(): Promise<any> {
  // Load CSS
  if (!document.querySelector('link[href*="leaflet"]')) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(link)
  }

  return new Promise((resolve, reject) => {
    if ((window as any).L) {
      resolve((window as any).L)
      return
    }
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.onload = () => resolve((window as any).L)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
}

document.addEventListener("nav", async () => {
  const container = document.getElementById("journey-map")
  if (!container) return

  const posts: MapPost[] = JSON.parse(container.dataset.posts || "[]")
  if (posts.length === 0) return

  const L = await loadLeaflet()

  // Clear previous map instance
  container.innerHTML = ""

  const map = L.map("journey-map", {
    zoomControl: true,
    attributionControl: true,
  }).setView([47.6062, -122.3321], 7)

  // Dark themed tiles — CartoDB Dark Matter (free, no key)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map)

  // Draw chronological journey line
  if (posts.length > 1) {
    const lineCoords = posts.map((p) => [p.coordinates[0], p.coordinates[1]])
    L.polyline(lineCoords, {
      color: "#D97706",
      weight: 2,
      opacity: 0.6,
      dashArray: "8, 12",
      lineCap: "round",
    }).addTo(map)
  }

  // Custom marker icon
  const createIcon = (index: number) =>
    L.divIcon({
      className: "journey-marker-wrapper",
      html: `<div class="journey-marker">${index + 1}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -18],
    })

  // Add markers
  posts.forEach((post, i) => {
    const thumbnailHtml = post.thumbnail
      ? `<img class="map-popup-img" src="${post.thumbnail}" alt="${post.title}" loading="lazy" />`
      : ""

    const tagsHtml = post.tags.length
      ? `<div class="map-popup-tags">${post.tags
          .slice(0, 3)
          .map((t) => `<span>#${t}</span>`)
          .join("")}</div>`
      : ""

    const popupContent = `
      <div class="map-popup">
        ${thumbnailHtml}
        <div class="map-popup-body">
          <p class="map-popup-title"><a href="/${post.slug}">${post.title}</a></p>
          <p class="map-popup-meta">${post.location} · ${formatDate(post.date)}</p>
          ${tagsHtml}
        </div>
      </div>
    `

    L.marker([post.coordinates[0], post.coordinates[1]], {
      icon: createIcon(i),
    })
      .bindPopup(popupContent, { maxWidth: 280, className: "journey-popup" })
      .addTo(map)
  })

  // Fit bounds
  if (posts.length > 0) {
    const bounds = L.latLngBounds(posts.map((p) => [p.coordinates[0], p.coordinates[1]]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 })
  }
})
