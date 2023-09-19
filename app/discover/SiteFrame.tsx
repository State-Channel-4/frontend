"use client"

import React from "react"
import { C4Content } from "@/types"

interface SiteFrameProps {
  site: C4Content | null
}

const SiteFrame: React.FC<SiteFrameProps> = ({ site }) => {
  if (!site) return null

  return (
    <section className="h-[768px] rounded-2xl bg-c4-gradient-main pe-2 ps-2">
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-secondary">
        <iframe src={site.url} title={site.title} className="h-full w-full" />
      </div>
    </section>
  )
}

export default SiteFrame
