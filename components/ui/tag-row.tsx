import { Tag, TagMap } from "@/types"
import { CheckCircle2, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  shownTags: TagMap
  selectable?: boolean
  selectedTags: TagMap
  setSelectedTags: (selectedTag: TagMap) => void
}

const TagRow = ({
  shownTags,
  selectable = false,
  selectedTags,
  setSelectedTags,
}: Props) => {
  const onTagClickHandler = (selectedTag: Tag) => {
    if (selectedTags.has(selectedTag._id)) {
      selectedTags.delete(selectedTag._id)
      setSelectedTags(new Map(selectedTags))
    } else {
      selectedTags.set(selectedTag._id, selectedTag)
      setSelectedTags(new Map(selectedTags))
    }
  }

  return (
    <>
      {shownTags && (
        <div className="flex flex-wrap gap-2">
          {Array.from(shownTags).map(([key, tag]) => (
            <button
              className={cn(
                "flex cursor-default items-center justify-center gap-2 rounded-full border-2 border-primary/30 px-3 py-1 text-sm font-medium text-primary transition",
                selectable &&
                  "hover:cursor-pointer hover:bg-primary/30 focus:bg-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                selectable && selectedTags.size > 0 && selectedTags.has(tag._id)
                  ? "border-yellow-400"
                  : ""
              )}
              key={key}
              tabIndex={0}
              onClick={() => onTagClickHandler(tag)}
            >
              {selectable && (
                <span>
                  {selectedTags.size > 0 && selectedTags.has(tag._id) ? (
                    <CheckCircle2 size={16} className="text-yellow-400" />
                  ) : (
                    <PlusCircle size={16} />
                  )}
                </span>
              )}
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default TagRow
