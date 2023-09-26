import { ReactNode } from "react"

export default function MainContentWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    // TODO: Remove hacky height fix once background image is replaced with countdown component
    <div className="h-[calc(100vh-136px)] flex-1 p-4 sm:px-8 sm:pb-0 sm:pt-6">
      <div className="h-full w-full overflow-auto rounded-2xl border border-shark-600">
        {children}
      </div>
    </div>
  )
}
