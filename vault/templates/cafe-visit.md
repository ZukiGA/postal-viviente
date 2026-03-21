---
title: "Cafe Visit Template ☕"
template: "cafe-visit"
---

# Cafe Visit Template ☕

This template guides you through documenting a cafe visit with 8 focused prompts.

---

## Frontmatter Schema

```yaml
---
title: "Cafe Name - Neighborhood"
slug: "cafe-name-neighborhood"
date: YYYY-MM-DD
published: false
template: "cafe-visit"
tags:
  - coffee
  - neighborhood-name
  - city-name
description: "Brief description for SEO"
location:
  name: "Cafe Name"
  neighborhood: "Neighborhood"
  city: "City"
rating: 5
gallery:
  - image1.jpg
  - image2.jpg
  - image3.jpg
---
```

---

## Screen 1 - Title & Details

**Prompt:**
```
Nombre del café:
[Cafe Vif]

Barrio/Zona:
[Capitol Hill]

Ciudad:
[Seattle]
```

---

## Screen 2 - Arrival

**Prompt:**
```
¿Cómo llegaste?
Walking? Driving? Random discovery?

[Caminando desde casa. 15 minutos. 
Hacía frío pero el sol acababa de salir.]
```

---

## Screen 3 - The Coffee

**Prompt:**
```
¿Qué pediste?

[Cortado. Doble shot.]

¿Cómo estuvo?

[Espresso balanceado. No amargo. Leche 
cremosa pero no demasiado dulce. Temperatura 
perfecta.]
```

---

## Screen 4 - The Atmosphere

**Prompt:**
```
¿Cómo se sintió el espacio cuando entraste?

[Luz natural entrando por ventanas grandes. 
3-4 personas trabajando en laptops. Música 
jazz bajito. Olor a pan recién horneado 
mezclado con café.]
```

---

## Screen 5 - Details You Noticed

**Prompt:**
```
Pequeños detalles que te llamaron la atención:

[- Plantas colgando del techo
- Barista tatuada con manos rápidas
- Menu escrito a mano en pizarra
- Sillas desiguales (vintage, no matching)
- Libro olvidado en la mesa del fondo]
```

---

## Screen 6 - Personal Reflection

**Prompt:**
```
¿Por qué este lugar funcionó para ti hoy?

[Necesitaba salir de casa. El café me dio 
excusa para caminar. El espacio se siente 
como si pudiera quedarme horas sin que nadie 
me moleste.]
```

---

## Screen 7 - Rating & Recommendation

**Prompt:**
```
Rating (1-5):
[5]

¿Volverías?
[Sí. Ya quiero volver mañana.]

¿Se lo recomendarías a alguien?
[A quien busque café bueno y espacio tranquilo 
para trabajar o leer.]
```

---

## Screen 8 - Preview & Publish

**Prompt:**
```
[Preview del draft generado]

Título: "Cafe Vif - Capitol Hill"
Gallery: 8 fotos
Tags: coffee, capitol-hill, seattle

[Save Draft]  [Publish Now]
```

---

## Example Output

```markdown
---
title: "Cafe Vif - Capitol Hill"
slug: "cafe-vif-capitol-hill"
date: 2026-03-21
published: true
template: "cafe-visit"
tags:
  - coffee
  - capitol-hill
  - seattle
description: "Morning cortado at Cafe Vif in Capitol Hill"
location:
  name: "Cafe Vif"
  neighborhood: "Capitol Hill"
  city: "Seattle"
rating: 5
gallery:
  - cafe-vif-exterior.jpg
  - cafe-vif-interior.jpg
  - cafe-vif-cortado.jpg
  - cafe-vif-barista.jpg
  - cafe-vif-window.jpg
  - cafe-vif-menu.jpg
  - cafe-vif-details.jpg
  - cafe-vif-atmosphere.jpg
---

# Cafe Vif - Capitol Hill

Caminando desde casa. 15 minutos. Hacía frío pero el sol acababa de salir.

## The Coffee

Cortado. Doble shot. Espresso balanceado. No amargo. Leche cremosa pero no demasiado dulce. Temperatura perfecta.

## The Space

Luz natural entrando por ventanas grandes. 3-4 personas trabajando en laptops. Música jazz bajito. Olor a pan recién horneado mezclado con café.

### Details

- Plantas colgando del techo
- Barista tatuada con manos rápidas
- Menu escrito a mano en pizarra
- Sillas desiguales (vintage, no matching)
- Libro olvidado en la mesa del fondo

## Reflection

Necesitaba salir de casa. El café me dio excusa para caminar. El espacio se siente como si pudiera quedarme horas sin que nadie me moleste.

**Rating:** 5/5 ☕☕☕☕☕

¿Volverías? Sí. Ya quiero volver mañana.

---

*Recommended for: Anyone looking for good coffee and quiet space to work or read.*
```
