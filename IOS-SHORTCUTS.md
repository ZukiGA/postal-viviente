# iOS Shortcuts + Telegram Bot Workflow

## Flujo Completo

**iPhone (Shortcuts) → iCloud Drive → Mac (Bot) → Obsidian**

---

## Setup del Bot (Ya completado ✅)

El bot está corriendo en tu Mac mini:
- **Status:** `~/projects/blog-bohemio/scripts/bot-daemon.sh status`
- **Logs:** `~/projects/blog-bohemio/scripts/bot-daemon.sh logs`
- **Restart:** `~/projects/blog-bohemio/scripts/bot-daemon.sh restart`

---

## iOS Shortcut: "Blog Bohemio Upload"

### Paso 1: Crear el Shortcut

1. Abre **Shortcuts** en tu iPhone
2. Tap **+** (crear shortcut)
3. Nombre: `Blog Bohemio Upload`

### Paso 2: Acciones (en orden)

**1. Select Photos**
- Tap "Add Action" → busca "Select Photos"
- Config: "Select Multiple" → ✅ ON

**2. Set Variable**
- Busca "Set Variable"
- Variable name: `SelectedPhotos`
- Value: `Select Photos` (de la acción anterior)

**3. Ask for Input**
- Busca "Ask for Input"
- Prompt: `Nombre del lugar/experiencia`
- Input Type: `Text`
- Default Answer: (vacío)

**4. Set Variable**
- Variable name: `PlaceName`
- Value: `Provided Input`

**5. Choose from Menu**
- Busca "Choose from Menu"
- Prompt: `Tipo de post`
- Opciones:
  - ☕ Cafe
  - 🍜 Food
  - 🌆 City
  - ✈️ Travel
  - 📝 Free

**6-10. Dentro de cada opción del menú:**

Para cada opción, agrega:
- **Set Variable:** `Template` = `cafe` (o `food`, `city`, `travel`, `free`)

**11. End Menu**

**12. Format Date**
- Busca "Format Date"
- Date: `Current Date`
- Format: `Custom` → `yyyyMMdd-HHmmss`

**13. Set Variable**
- Variable name: `Timestamp`
- Value: `Formatted Date`

**14. Text**
- Busca "Text"
- Content:
  ```
  [Timestamp]-[PlaceName]
  ```
  (Usa las variables insertadas)

**15. Set Variable**
- Variable name: `FolderName`
- Value: `Text` (de la acción anterior)

**16. Save File**
- Busca "Save File"
- File: `SelectedPhotos`
- Destination: `iCloud Drive/Blog Bohemio Uploads/[FolderName]/`
- **Importante:** 
  - Service: `iCloud Drive`
  - Ask Where to Save: ❌ OFF
  - Overwrite: ✅ ON

**17. Send Message (Telegram)**
- Busca "Send Message" (Telegram)
- Recipient: Busca tu propio contacto (no el bot, tú mismo)
- Message:
  ```
  /upload [FolderName] [Template]
  ```
  (Usa las variables)

**18. Show Notification**
- Busca "Show Notification"
- Title: `Fotos subidas`
- Body: `Draft en proceso...`

### Paso 3: Probar

1. Corre el shortcut
2. Selecciona fotos
3. Escribe nombre
4. Elige tipo
5. El shortcut:
   - Sube fotos a iCloud Drive
   - Envía comando al bot
6. Bot procesa y crea draft en Obsidian
7. Recibes notificación en Telegram

---

## Comandos del Bot

**Manual (si quieres):**
- `/upload [folder_name] [template]` — Procesa upload de iCloud Drive
- `/status` — Ver drafts pendientes
- `/drafts` — Listar todos los drafts

**Ejemplo:**
```
/upload 20260321-142030-Cafe-Moka cafe
```

---

## Alternativa: Share Sheet

Más simple, sin shortcut complejo:

**Setup:**
1. Shortcut → Add to Share Sheet
2. Accepts: `Images`

**Flujo:**
1. En Photos, selecciona álbum
2. Tap Share → `Blog Bohemio Upload`
3. Sigue los prompts

---

## Troubleshooting

**"Bot no responde":**
```bash
~/projects/blog-bohemio/scripts/bot-daemon.sh status
~/projects/blog-bohemio/scripts/bot-daemon.sh restart
```

**"Upload folder not found":**
- Espera 10-30 segundos (iCloud sync delay)
- Verifica carpeta en Finder: iCloud Drive → Blog Bohemio Uploads

**"No images found":**
- Asegúrate de que Save File guardó en la carpeta correcta
- Revisa el path en la acción Save File

---

## Tips

- **Nombres:** Usa nombres descriptivos (ej: "Cafe Moka Capitol Hill")
- **Sync:** iCloud Drive puede tardar ~10-30 seg en sincronizar
- **Cleanup:** El bot borra la carpeta de upload después de procesar
- **Offline:** Funciona sin internet (sync cuando reconectes)

---

## Próximas Mejoras

- [ ] Auto-detect álbum name de Photos metadata
- [ ] Sugerir template basado en fotos (IA)
- [ ] Notificación cuando draft esté listo
- [ ] Previsualización del draft en Telegram
