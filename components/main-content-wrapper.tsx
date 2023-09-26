import { ReactNode } from "react"

export default function MainContentWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <div className="pt-6 px-8 flex-1">
      <div className="border border-shark-600 w-full overflow-auto rounded-2xl h-full">
        {children}
      </div>
    </div>
  )
}
