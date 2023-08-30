"use client";

import { C4Content } from "@/types";
import React from "react";

interface SiteFrameProps{
  site: C4Content | null;
}

const SiteFrame: React.FC<SiteFrameProps> = ({ site }) => {
  if (!site) return null;

  return (
    <section className="bg-c4-gradient-main h-[768px] rounded-2xl pe-2 ps-2">
      <div className="bg-secondary relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
        <iframe src={site.url} title={site.title} className="h-full w-full" />
      </div>
    </section>
  )
}

export default SiteFrame