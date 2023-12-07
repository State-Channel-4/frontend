"use client"

import { useState } from "react"
import Image from "next/image"
import BadURLDisplay from "@/assets/bad-url-display.png"

interface SubmitSiteFrame {
  url: string
}

export function SubmitSiteFrame({ url }: SubmitSiteFrame): JSX.Element {
  const [error] = useState<Error | null>(null)

  return (
    <div className="mt-2 h-[280px] rounded-2xl border border-shark-600 md:h-[239px]">
      {error ? (
        <div className="flex h-full items-center justify-center rounded-2xl bg-shark-200">
          <div className="px-4 text-shark-800">
            Can&apos;t connect. Please try a different URL
          </div>
        </div>
      ) : url ? (
        <iframe className="h-full w-full rounded-2xl" src={url} />
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
