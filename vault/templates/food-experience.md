---
title: "Food Experience Template 🍜"
template: "food-experience"
---

# Food Experience Template 🍜

This template guides you through documenting a food experience with 6 focused prompts.

---

## Frontmatter Schema

```yaml
---
title: "Dish/Restaurant Name"
slug: "dish-restaurant-name"
date: YYYY-MM-DD
published: false
template: "food-experience"
tags:
  - food
  - cuisine-type
  - neighborhood
description: "Brief description"
location:
  name: "Restaurant Name"
  neighborhood: "Neighborhood"
  city: "City"
rating: 5
gallery:
  - food-photo1.jpg
  - food-photo2.jpg
---
```

---

## Screen 1 - First Impressions

**Prompt:**
```
¿Qué pediste?

[Tonkotsu ramen + gyoza]

Primera impresión cuando llegó el plato:

[El bol humeante. Olor increíble antes de 
probar. Presentación simple pero cuidada.]
```

---

## Screen 2 - The Taste

**Prompt:**
```
Describe el sabor:

[Caldo rico, cremoso, umami profundo. 
Fideos perfectos al dente. Chashu derritiéndose 
en la boca. Egg yolk líquido (perfecto).]
```

---

## Screen 3 - Context & Atmosphere

**Prompt:**
```
¿Dónde estabas comiendo?

[Restaurante pequeño en Fremont. 12 asientos. 
Chef visible cocinando. Música j-pop de fondo.]

¿Con quién? ¿Solo?

[Solo. Barra frente al chef.]
```

---

## Screen 4 - What Stood Out

**Prompt:**
```
¿Qué te sorprendió o destacó?

[El chashu. Había probado ramen antes pero 
este chashu estaba en otro nivel. También 
el servicio — chef preguntó si quería más 
caldo (gratis).]
```

---

## Screen 5 - Final Thoughts

**Prompt:**
```
¿Cómo te sentiste después?

[Full pero no incómodo. Satisfecho. 
Calentito por dentro (perfect para día frío).]
```

---

## Screen 6 - Rating & Recommendation

**Prompt:**
```
Rating (1-5):
[5]

¿Volverías?
[Absolutamente. Ya quiero probar el miso ramen.]

¿Se lo recomendarías?
[A cualquiera que le guste el ramen real. 
No para quienes buscan ramen "fusion" o fancy.]

[Save Draft]  [Publish Now]
```

---

## Example Output

```markdown
---
title: "Tonkotsu Ramen at Ramen Danbo"
slug: "tonkotsu-ramen-danbo-fremont"
date: 2026-03-21
published: true
template: "food-experience"
tags:
  - ramen
  - japanese
  - fremont
  - seattle
description: "Best tonkotsu ramen in Fremont"
location:
  name: "Ramen Danbo"
  neighborhood: "Fremont"
  city: "Seattle"
rating: 5
gallery:
  - ramen-bowl.jpg
  - gyoza-plate.jpg
  - restaurant-interior.jpg
  - chef-cooking.jpg
---

# Tonkotsu Ramen at Ramen Danbo

El bol humeante. Olor increíble antes de probar. Presentación simple pero cuidada.

## The Taste

Caldo rico, cremoso, umami profundo. Fideos perfectos al dente. Chashu derritiéndose en la boca. Egg yolk líquido (perfecto).

## Where & When

Restaurante pequeño en Fremont. 12 asientos. Chef visible cocinando. Música j-pop de fondo. Solo, sentado en la barra frente al chef.

## What Stood Out

El chashu. Había probado ramen antes pero este chashu estaba en otro nivel. También el servicio — chef preguntó si quería más caldo (gratis).

## After

Full pero no incómodo. Satisfecho. Calentito por dentro (perfect para día frío).

**Rating:** 5/5 🍜🍜🍜🍜🍜

---

*Would return: Absolutely. Already want to try the miso ramen.*  
*Recommended for: Anyone who likes real ramen. Not for those looking for "fusion" or fancy interpretations.*
```
