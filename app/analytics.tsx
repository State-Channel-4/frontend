"use client"

import { useEffect } from "react"

import { cn } from "@/lib/utils"

// import { useSwetrix } from "@swetrix/nextjs"

export default function AnalyticWrapper({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  useEffect(() => {
    // @ts-ignore
    var _mtm = (window._mtm = window._mtm || [])
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" })
    ;(function () {
      var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0]
      g.async = true
      g.src = process.env.NEXT_PUBLIC_MATOMO_URL || ""

      if (s.parentNode) s.parentNode.insertBefore(g, s)
    })()
  }, [])
  return <div className={cn("flex-1", className)}>{children}</div>
}
