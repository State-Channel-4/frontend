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
    <div className="mt-2 h-[280px] rounded-2xl border border-shark-600 md:h-[239px]">
      {error ? (
        <div className="flex h-full items-center justify-center rounded-2xl bg-shark-200">
          <div className="px-4 text-shark-800">
            Can&apos;t connect. Please try a different URL
          </div>
        </div>
      ) : iframeUrl ? (
        <iframe className="h-full w-full rounded-2xl" src={iframeUrl} title="Website Preview" />
      ) : (
        <Image
          alt="No URL"
          className="h-full w-full rounded-2xl"
          src={BadURLDisplay}
        />
      )}
    </div>
  )
}
