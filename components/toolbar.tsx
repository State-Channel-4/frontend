"use client"

import Image from "next/image"

import useMix from "@/app/hooks/useMix"

import Channel4Icon from "../assets/channel-4-icon-v2.svg"
import { Button } from "./ui/button"

const Toolbar = () => {
  const { changeSite, currentSite } = useMix()

  return (
    <div className="h-[120px] py-6 px-8 flex items-center justify-between">
      <div className="flex gap-1">
        <Image priority src={Channel4Icon} alt="Channel 4 icon black" />
        <div>Weclome to Channel 4</div>
      </div>
      {/* <div>Start watching</div> */}
      <Button
        className="bg-c4-gradient-green hover:bg-c4-gradient-green-rev"
        onClick={() => changeSite()}
      >
        Start watching
      </Button>
    </div>
  )
}

export default Toolbar
