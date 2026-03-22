import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const TagList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const tags = fileData.frontmatter?.tags
  if (tags && tags.length > 0) {
    return (
      <ul class={classNames(displayClass, "tags")}>
        {tags.map((tag) => {
          const linkDest = resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)
          return (
            <li>
              <a href={linkDest} class="internal tag-link">
                #{tag}
              </a>
            </li>
          )
        })}
      </ul>
    )
  } else {
    return null
  }
}

TagList.css = `
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.5rem;
  margin: 0.3rem 0 0.8rem 0;
  flex-wrap: wrap;
}

.section-li > .section > .tags {
  justify-content: flex-end;
}

.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  border-radius: 20px;
  background-color: #f5f1e8;
  color: var(--soft-black, #1a1a1a);
  padding: 0.3rem 0.8rem;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
  border: 1px solid #d9d3c7;
  box-shadow: none;
  transition: all 0.2s ease;
}

a.internal.tag-link::before {
  content: none !important;
}

a.internal.tag-link:hover {
  background-color: var(--olive-green, #6B8E23);
  color: white;
  border-color: var(--olive-green, #6B8E23);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(139, 125, 107, 0.2);
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
