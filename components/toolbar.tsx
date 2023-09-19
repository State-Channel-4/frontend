"use client"

import { useMemo } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import EmptyHeart from "@/assets/empty-heart.svg"
import useMix from "@/contexts/MixContext"

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
    <div className="h-[120px] flex items-center justify-between">
      <div className="flex gap-4  items-center">
        <div className="cursor-pointer shadow-menuShadow rounded-full p-3">
          <Image
            className="w-8 h-8"
            priority
            src={Channel4Icon}
            alt="Channel 4 icon black"
          />
        </div>
        <div>
          <div className="font-medium truncate">
            {isDiscover
              ? currentSite?.title ?? "Site name not avaialable."
              : "Weclome to Channel 4"}
          </div>
          {isDiscover && (
            <div className="text-shark-300 text-xs truncate">See details</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-8">
        {isDiscover && (
          <div className="flex gap-2 items-center cursor-pointer relative text-sm">
            {/* <div className="absolute p-4 border border-shark-800 rounded-lg bg-shark-950 w-64">
              Please sign in to like this.
            </div> */}
            <Image alt="Like" className="w-4 h-4" src={EmptyHeart} />
            <div>{currentSite?.likes}</div>
          </div>
        )}
        <Button
          className="bg-c4-gradient-green hover:bg-c4-gradient-green-rev"
          onClick={() => (isDiscover ? changeSite() : router.push("discover"))}
        >
          {isDiscover ? "Next" : "Start watching"}
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
