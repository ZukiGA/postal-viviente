import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Gallery: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const gallery = fileData.frontmatter?.gallery
  
  if (!gallery || gallery.length === 0) {
    return null
  }

  return (
    <div class={classNames(displayClass, "gallery")}>
      {gallery.map((image: string) => {
        const imageName = image.replace(/\.[^/.]+$/, "") // Remove extension
        const baseUrl = "/blog-bohemio/static/images"
        
        return (
          <picture key={image}>
            <source 
              srcset={`${baseUrl}/${imageName}-400w.webp 400w, ${baseUrl}/${imageName}-800w.webp 800w, ${baseUrl}/${imageName}-1600w.webp 1600w`}
              type="image/webp"
            />
            <source 
              srcset={`${baseUrl}/${imageName}-400w.jpg 400w, ${baseUrl}/${imageName}-800w.jpg 800w, ${baseUrl}/${imageName}-1600w.jpg 1600w`}
              type="image/jpeg"
            />
            <img 
              src={`${baseUrl}/${imageName}-800w.jpg`}
              alt={imageName}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </picture>
        )
      })}
    </div>
  )
}

Gallery.css = `
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.gallery picture {
  display: block;
}

.gallery img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.gallery img:hover {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .gallery {
    grid-template-columns: 1fr;
  }
  
  .gallery::after {
    content: "← Swipe →";
    display: block;
    text-align: center;
    color: var(--gray);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    grid-column: 1 / -1;
  }
}
`

export default (() => Gallery) satisfies QuartzComponentConstructor
