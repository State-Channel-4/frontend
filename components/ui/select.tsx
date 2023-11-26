import { Dispatch, MouseEvent, SetStateAction, useMemo, useState } from "react"
import { ChevronDown, X } from "lucide-react"

interface SelectProps {
  options: Array<string>
  selected: Array<string>
  setSelected: (option: string) => void
}

export default function Select({
  selected,
  setSelected,
  options,
}: SelectProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  const filteredOptions = useMemo(() => {
    return options.filter((option) => !selected.includes(option))
  }, [options, selected])

  const removeSelection = (
    selection: string,
    event: MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation()
    // setSelected((prev) => prev.filter((option) => option !== selection))
  }

  return (
    <div
      className="cursor-pointer h-12 px-3 border-[1.5px] mt-4 rounded-lg border-shark-800 flex justify-between w-full relative items-center"
      onClick={() => filteredOptions.length && setExpanded(!expanded)}
    >
      {selected.length ? (
        <div className="flex gap-2 overflow-x-auto shrink-0 max-w-md">
          {selected.map((option) => (
            <div className="bg-shark-700 flex items-center gap-1 px-2 py-1 rounded text-shark-200 text-sm">
              <div>{option}</div>
              <div
                className="bg-shark-900 p-0.5 rounded"
                // @ts-ignore
                onClick={(e) => removeSelection(option, e)}
              >
                <X size={10} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div />
      )}
      <ChevronDown color="#f6f7f9" size={24} />
      {expanded && (
        <div className="absolute bg-shark-950 border-[1.5px] border-t-0 border-shark-800 max-h-[200px] ml-[-13.5px] rounded-b-lg w-[calc(100%+3px)] top-[85%] z-50">
          {filteredOptions.map((option) => (
            <div
              className="px-4 hover:bg-shark-700"
              // onClick={() => setSelected((prev) => [...prev, option])}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
