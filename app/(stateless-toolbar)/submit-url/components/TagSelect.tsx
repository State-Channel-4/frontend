import { MouseEvent, useMemo, useRef, useState } from "react"
import { ChevronDown, X } from "lucide-react"

import { useOutsideAlerter } from "@/app/hooks/useOutsideAlerter"

interface SelectProps {
  onRemove: (index: number) => void
  onSelect: (option: string) => void
  options: Array<string>
  selected: Array<string>
}

export default function Select({
  onRemove,
  onSelect,
  options,
  selected,
}: SelectProps): JSX.Element {
  const selectRef = useRef(null)
  const [expanded, setExpanded] = useState(false)

  const filteredOptions = useMemo(() => {
    return options.filter((option) => !selected.includes(option))
  }, [options, selected])

  const removeSelection = (
    event: MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    event.stopPropagation()
    onRemove(index)
  }

  useOutsideAlerter(selectRef, () => setExpanded(false))

  return (
    <div
      className="relative mt-3 flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border-[1.5px] border-shark-800 px-3"
      ref={selectRef}
      onClick={() => filteredOptions.length && setExpanded(!expanded)}
    >
      {selected.length ? (
        <div className="flex max-w-md shrink-0 gap-2 overflow-x-auto">
          {selected.map((option, index) => (
            <div
              className="flex items-center gap-1 rounded bg-shark-700 px-2 py-1 text-sm text-shark-200"
              key={option}
            >
              <div>{option}</div>
              <div
                className="rounded bg-shark-900 p-0.5"
                // @ts-ignore
                onClick={(e) => removeSelection(e, index)}
              >
                <X size={10} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div />
      )}
      <ChevronDown className="stroke-shark-200" size={24} />
      {expanded && (
        <div className="absolute top-[85%] z-10 ml-[-13.5px] max-h-[100px] w-[calc(100%+3px)] overflow-y-auto rounded-b-lg border-[1.5px] border-t-0 border-shark-800 bg-shark-950">
          {filteredOptions.map((option) => (
            <div
              className="px-4 last:rounded-b-md hover:bg-shark-700"
              key={option}
              onClick={() => onSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
