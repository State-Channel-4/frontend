"use client"

import { Tag, TagMap } from "@/types"
import { CheckCircle2, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { memo, useCallback, useMemo, useState } from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import { buttonVariants } from "./button"

interface TagButtonProps {
  tag: Tag;
  selectedTags: TagMap;
  onSelect: (selectedTag: Tag) => void;
  selectable: boolean;
}

interface TagListProps {
  tags: TagMap
  title?: string
  selectable?: boolean
}

const TagButton = memo(({ tag, selectedTags, onSelect, selectable }: TagButtonProps) => {
  const isSelected = useMemo(() => selectedTags.has(tag._id), [
    selectedTags,
    tag,
  ])

  return (
    <button
      className={cn(
        "border-primary/30 text-primary flex cursor-default items-center justify-center gap-2 rounded-full border-2 px-3 py-1 text-sm font-medium transition",
        selectable &&
        "hover:bg-primary/30 focus:bg-primary/40 focus-visible:ring-offset-muted hover:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2",
        isSelected ? "border-yellow-400" : ""
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
      {tag.name}
    </button>
  )
})

const TagList = ({ tags, title, selectable = false }: TagListProps) => {
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<TagMap>(new Map())

  const handleSelectedTags = useCallback((selectedTag: Tag) => {
    setSelectedTags((currentTags) => {
      const newTags = new Map(currentTags)
      if (newTags.has(selectedTag._id)) {
        newTags.delete(selectedTag._id)
      } else {
        newTags.set(selectedTag._id, selectedTag)
      }
      return newTags
    })
  }, [])

  const handleDiscover = () => {
    if (selectedTags.size > 0) {
      sessionStorage.setItem(
        "c4.tags",
        JSON.stringify(Array.from(selectedTags.entries()))
      )
    }
    router.push(siteConfig.links.discover)
  }

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
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
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
          <button
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-c4-gradient-main font-bold transition hover:scale-105"
            )}
            onClick={() => handleDiscover()}
          >
            Start your journey ✨
          </button>
        </>
      )}
    </section>
  )
}

export default TagList
