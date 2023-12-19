"use client"

import { memo, useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { Tag, TagMap } from "@/types"
import { CheckCircle2, PlusCircle } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { Button, buttonVariants } from "./button"

interface TagButtonProps {
  tag: Tag
  selectedTags: TagMap
  onSelect: (selectedTag: Tag) => void
  selectable: boolean
}

interface TagListProps {
  tags: TagMap
  title?: string
  selectable?: boolean
}

const TagButton = memo(
  ({ tag, selectedTags, onSelect, selectable }: TagButtonProps) => {
    const isSelected = useMemo(
      () => selectedTags.has(tag._id),
      [selectedTags, tag]
    )

    return (
      <button
        className={cn(
          "flex cursor-default items-center justify-center gap-2 rounded-full border-2 border-primary/30 px-3 py-1 text-sm font-medium text-primary transition",
          selectable &&
            "hover:cursor-pointer hover:bg-primary/30 focus:bg-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
          isSelected && selectable ? "border-yellow-400" : ""
        )}
        tabIndex={0}
        onClick={() => onSelect(tag)}
      >
        {selectable && (
          <span>
            {isSelected ? (
              <CheckCircle2 size={16} className="text-yellow-400" />
            ) : (
              <PlusCircle size={16} />
            )}
          </span>
        )}
        {tag.name.toLowerCase()}
      </button>
    )
  }
)

TagButton.displayName = "TagButton"

const TagList = ({ tags, title, selectable = false }: TagListProps) => {
  const storedTags = () => {
    if (selectable) {
      const sessionTags = sessionStorage.getItem("c4.tags")
      return sessionTags ? new Map(JSON.parse(sessionTags)) : new Map()
    }
    return new Map()
  }

  const [selectedTags, setSelectedTags] = useState<TagMap>(
    storedTags() as TagMap
  )

  const handleSelectedTags = useCallback(
    (selectedTag: Tag) => {
      if (!selectable) return
      setSelectedTags((currentTags) => {
        const newTags = new Map(currentTags)
        if (newTags.has(selectedTag._id)) {
          newTags.delete(selectedTag._id)
        } else {
          newTags.set(selectedTag._id, selectedTag)
        }

        if (newTags.size > 0) {
          sessionStorage.setItem(
            "c4.tags",
            JSON.stringify(Array.from(newTags.entries()))
          )
        } else {
          sessionStorage.removeItem("c4.tags")
        }
        return newTags
      })
    },
    [selectable]
  )

  return (
    <section>
      {!tags && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold" id="tag-list-label">
            We couldn&apos;t find any tags. Please try again later.
          </h2>
        </div>
      )}

      {tags && (
        <div className="flex flex-col gap-2">
          {title && <h4 className="text-base font-semibold">{title}</h4>}
          <div className="flex flex-wrap gap-2">
            {Array.from(tags).map(([key, tag]) => (
              <TagButton
                key={key}
                tag={tag}
                selectedTags={selectedTags}
                onSelect={handleSelectedTags}
                selectable={selectable}
              />
            ))}
          </div>
        </div>
      )}

      {selectable && (
        <>
          <div className="p-4"></div>
          <Link href={siteConfig.links.discover} passHref>
            <Button
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-c4-gradient-main font-bold transition hover:scale-105"
              )}
            >
              Start your journey ✨
            </Button>
          </Link>
        </>
      )}
    </section>
  )
}

export default TagList
