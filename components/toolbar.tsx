"use client"

import { useMemo } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import EmptyHeart from "@/assets/empty-heart.svg"
import { C4Content } from "@/types"

import Channel4Icon from "../assets/channel-4-icon-v2.svg"
import { Button } from "./ui/button"

interface ToolbarProps {
  changeSite?: () => void
  currentSite?: C4Content | null
  isLoading?: boolean
}

const Toolbar = ({ changeSite, currentSite, isLoading }: ToolbarProps) => {
  const path = usePathname()
  const router = useRouter()

  const isDiscover = useMemo(() => {
    return path === "/discover"
  }, [path])

  return (
    <div className="flex items-center justify-between gap-4 relative px-8 py-6">
      <div className="flex gap-4 items-center flex-shrink flex-grow min-w-0">
        <div className="cursor-pointer shadow-menuShadow rounded-full p-4 shrink-0">
          <Image
            className="w-10 h-10"
            priority
            src={Channel4Icon}
            alt="Channel 4 icon black"
          />
        </div>
        <div className="min-w-0">
          <div className="font-medium truncate">
            {isDiscover
              ? currentSite?.title ?? "Site name not avaialable."
              : "Weclome to Channel 4"}
          </div>
          {isDiscover && !isLoading && (
            <div className="text-shark-300 text-xs truncate">See details</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-8 shrink-0">
        {isDiscover && !isLoading && (
          <div className="flex gap-2 items-center cursor-pointer relative text-sm">
            <Image alt="Like" className="w-4 h-4" src={EmptyHeart} />
            <div>{currentSite?.likes}</div>
          </div>
        )}
        <Button
          className="h-auto bg-c4-gradient-green hover:bg-c4-gradient-green-rev sm:px-16 py-2 px-6"
          onClick={() =>
            isDiscover && changeSite ? changeSite() : router.push("discover")
          }
        >
          {isDiscover ? "Next" : "Start watching"}
        </Button>
      </div>
    </div>
  )
}

export default Toolbar
