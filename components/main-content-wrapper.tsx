import { ReactNode } from "react"

export default function MainContentWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <div className="h-[calc(100svh-144px)] flex-1 p-4 md:px-8 md:pb-0 md:pt-6">
      <div className="h-full w-full overflow-hidden rounded-2xl border border-shark-600">
        {children}
      </div>
    </div>
  )
}
