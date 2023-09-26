import { ReactNode } from "react"

export default function MainContentWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    // TODO: Remove hacky height fix once background image is replaced with countdown component
    <div className="p-4 sm:pb-0 sm:pt-6 sm:px-8 flex-1 h-[calc(100vh-136px)]">
      <div className="border border-shark-600 w-full overflow-auto rounded-2xl h-full">
        {children}
      </div>
    </div>
  )
}
