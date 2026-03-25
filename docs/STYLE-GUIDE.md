# Style Guide — Postal Viviente

## Idioma
- **Español latino/mexicano** — nunca español de España
- No usar voseo (ás, ós, sos) — usar tú/tu conjugación normal
- Expresiones naturales mexicanas están bien (güey, chido, neta, etc.) si encajan con el tono

## Tono
- **Crónica personal/reflexiva** — como si le contaras a un amigo
- Honesto, no pretencioso. Si algo estuvo difícil, decirlo. Si algo estuvo increíble, decirlo
- Oraciones cortas cuando la emoción es fuerte. Párrafos largos cuando hay historia que contar
- Humor sutil, no forzado
- Cerrar con reflexión personal, no con "conclusiones" genéricas

## Estructura de Posts
1. **Apertura** — una línea que enganche (observación, sensación, contradicción)
2. **Contexto** — quién, cómo llegaste ahí, por qué
3. **La historia** — secciones con ## headers, fotos intercaladas
4. **Cierre** — "Lo Que Me Llevo" — reflexión corta y personal

## Fotos
- Máximo 10-12 por post (menos es más)
- Intercaladas con el texto, no todas al final
- Caption corto y descriptivo, no poético
- Formato: `![Caption](/static/images/[slug]/photo-N-800w.jpg)`
- Source files nombrados `photo-N.jpg` (sin sufijo de tamaño — el optimizer los genera)

## Proceso de Importación de Fotos
```bash
# Importar fotos seleccionadas (en orden)
node scripts/import-photos.js <source-dir> <slug> "DSCF5002,DSCF5001,DSCF5010"

# Importar todas las fotos de un directorio
node scripts/import-photos.js <source-dir> <slug>
```

El script:
- Auto-rota por EXIF (resuelve fotos verticales)
- Resize a 1600px wide
- Strip EXIF completo
- Genera manifest con referencias markdown listas para copiar

## Proceso de Publicación
```bash
cd ~/projects/blog-bohemio
./scripts/new-post.sh "New post: Título del post"
```

El script valida:
- Que las referencias de imagen en markdown tengan source files
- Que no se borren posts existentes por accidente (rsync)
- Que no haya datos GPS en EXIF

## Frontmatter
```yaml
---
title: "Título"
date: YYYY-MM-DD          # Fecha del evento, no de publicación
tags: [adventure, pnw]
location: "Lugar, Estado/País"
rating: 1-5
thumbnail: "/static/images/[slug]/photo-N-800w.jpg"
distance: "Xh XXm desde Seattle"    # opcional
weather: "Descripción corta"        # opcional
wouldReturn: true/false              # opcional
activity: "Hiking"                   # opcional
companions: "Nombres"               # opcional
template: "travel-story"
---
```

## No Hacer
- No usar markdown tables (se ven mal en mobile)
- No headers H1 (#) en el contenido — el título viene del frontmatter
- No links a redes sociales de las personas mencionadas
- No compartir ubicaciones exactas/direcciones de personas
- No publicar fotos donde alguien se vea mal sin su permiso
