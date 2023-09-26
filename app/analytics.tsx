"use client"

import { useEffect } from "react"

// import { useSwetrix } from "@swetrix/nextjs"

export default function AnalyticWrapper({
  children,
}: {
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
  return <>{children}</>
}
