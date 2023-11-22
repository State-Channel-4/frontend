import Image from "next/image"
import BadURLDisplay from "@/assets/bad-url-display.png"

interface SubmitSiteFrame {
  error: Error | null
}

export function SubmitSiteFrame({ error }: SubmitSiteFrame): JSX.Element {
  return (
    <div className="rounded-2xl border border-shark-600 grow mt-2 rounded-2xl h-full">
      {error ? (
        <div className="bg-shark-200 h-full rounded-2xl flex items-center justify-center">
          <div className="px-4 text-shark-800">
            Can't connect. Please try a different URL
          </div>
        </div>
      ) : (
        <Image alt="No URL" className="rounded-2xl" src={BadURLDisplay} />
      )}
    </div>
  )
}
