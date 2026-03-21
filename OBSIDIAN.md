# Obsidian Integration

Blog Bohemio está integrado con tu vault de Obsidian para que puedas escribir posts en una interfaz familiar.

## Setup (Ya completado)

Tu vault de Obsidian ya tiene la carpeta `Blog Bohemio/` con:
- `published/` — Posts publicados en el blog
- `drafts/` — Borradores en progreso
- `images/` — Fotos para los posts
- `templates/` — 5 plantillas (cafe, food, city, travel, free-form)

**Ubicación:** `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian thoughts/Blog Bohemio/`

## Workflow: Escribir y Publicar

### 1. Escribir en Obsidian

**En tu vault "obsidian thoughts":**

1. Abre la carpeta `Blog Bohemio/drafts/`
2. Crea un nuevo archivo (o usa templates)
3. Escribe tu post con el frontmatter:
   ```yaml
   ---
   title: Nombre del lugar
   date: 2026-03-21
   tags: [cafe, seattle]
   location: Capitol Hill, Seattle
   rating: 5
   gallery:
     - foto1.jpg
     - foto2.jpg
   ---
   ```
4. Escribe el contenido (usa markdown normal)
5. Guarda fotos en `Blog Bohemio/images/`

### 2. Mover a Published

Cuando el post esté listo:
- Arrastra el archivo de `drafts/` → `published/YYYY-MM/`
- Organiza por mes (ej: `published/2026-03/cafe-moka.md`)

### 3. Publicar al Blog

**Desde terminal:**

```bash
cd ~/projects/blog-bohemio
./scripts/publish.sh "Nuevo post: Cafe Moka"
```

El script:
1. Sincroniza de Obsidian → repo local
2. Muestra qué cambió
3. Te pregunta si quieres publicar
4. Commit + push → auto-deploy

**Resultado:** Tu post estará live en ~1 minuto en https://zukiga.github.io/blog-bohemio/

---

## Tips

**Templates en Obsidian:**
- Los templates están en `Blog Bohemio/templates/`
- Usa Cmd+P → "Insert template" para aplicarlos

**Organización:**
- `published/YYYY-MM/` — Posts por mes
- `drafts/` — Sin estructura fija, como quieras
- `images/` — Todas las fotos juntas (el script las optimiza al publicar)

**Preview:**
- Obsidian muestra el preview del markdown
- Para ver cómo se verá en el blog, corre build local:
  ```bash
  cd ~/projects/blog-bohemio
  node scripts/sync-from-obsidian.js
  cd quartz && npx quartz build --serve
  ```

**Mobile:**
- Si tienes Obsidian mobile + iCloud sync, puedes escribir desde tu iPhone
- Las fotos del iPhone irán directo a `Blog Bohemio/images/`
- Publica desde el Mac cuando regreses

---

## Alternativa: Publish Script Automático

Si quieres que publique automáticamente sin preguntar:

```bash
cd ~/projects/blog-bohemio
./scripts/publish.sh "Auto-publish" --yes
```

(TODO: Agregar flag `--yes` al script)

---

## Troubleshooting

**"No changes to publish":**
- Asegúrate de que moviste archivos a `published/` (no solo `drafts/`)
- Verifica que guardaste en Obsidian (iCloud sync puede tardar)

**"Obsidian vault not found":**
- Verifica la ruta: `~/Library/Mobile Documents/iCloud~md~obsidian/Documents/obsidian thoughts/`
- Asegúrate de que la carpeta `Blog Bohemio/` existe

**Build falla con "GPS data detected":**
- Alguna foto tiene datos de ubicación
- Usa una app para limpiar EXIF antes de subir (o el script falla a propósito para proteger privacidad)
