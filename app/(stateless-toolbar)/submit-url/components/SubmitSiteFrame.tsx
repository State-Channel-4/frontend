"use client"

import { useState } from "react"
import Image from "next/image"
import BadURLDisplay from "@/assets/bad-url-display.png"

import { useDebounce } from "@/app/hooks/useDebounce"

interface SubmitSiteFrame {
  url: string
}

export function SubmitSiteFrame({ url }: SubmitSiteFrame): JSX.Element {
  const [error] = useState<Error | null>(null)
  const iframeUrl = useDebounce(url, 500)

  return (
    <div className="rounded-2xl border border-shark-600 mt-2 rounded-2xl h-full">
      {error ? (
        <div className="bg-shark-200 h-full rounded-2xl flex items-center justify-center">
          <div className="px-4 text-shark-800">
            Can't connect. Please try a different URL
          </div>
        </div>
      ) : iframeUrl ? (
        <iframe className="h-full w-full rounded-2xl" src={iframeUrl} />
      ) : (
        <Image
          alt="No URL"
          className="rounded-2xl h-full max-h-[239px]"
          src={BadURLDisplay}
        />
      )}
    </div>
  )
}
