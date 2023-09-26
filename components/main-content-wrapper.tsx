import { ReactNode } from "react"

export default function MainContentWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <div className="p-4 sm:pb-0 sm:pt-6 sm:px-8 flex-1">
      <div className="border border-shark-600 w-full overflow-auto rounded-2xl h-full">
        {children}
      </div>
    </div>
  )
}
