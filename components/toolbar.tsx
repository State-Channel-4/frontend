"use client"

import { useMemo } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import useMix from "@/app/hooks/useMix"

import Channel4Icon from "../assets/channel-4-icon-v2.svg"
import { Button } from "./ui/button"

const Toolbar = () => {
  const path = usePathname()
  const router = useRouter()
  const { changeSite, currentSite } = useMix()

  const isDiscover = useMemo(() => {
    return path === "/discover"
  }, [path])

  return (
    <div className="h-[80px] flex items-center justify-between">
      <div className="flex gap-2">
        <Image priority src={Channel4Icon} alt="Channel 4 icon black" />
        <div className="font-medium">Weclome to Channel 4</div>
      </div>
      {/* <div>Start watching</div> */}
      <Button
        className="bg-c4-gradient-green hover:bg-c4-gradient-green-rev"
        onClick={() => (isDiscover ? changeSite() : router.push("discover"))}
      >
        {isDiscover ? "Next" : "Start watching"}
      </Button>
    </div>
  )
}

export default Toolbar
