"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import EmptyHeart from "@/assets/empty-heart.svg"
import { C4Content } from "@/types"

import Channel4Icon from "../assets/channel-4-icon-v2.svg"
import MainMenu from "./main-menu"
import { Button } from "./ui/button"

interface ToolbarProps {
  changeSite?: () => void
  currentSite?: C4Content | null
  isLoading?: boolean
}

const Toolbar = ({ changeSite, currentSite, isLoading }: ToolbarProps) => {
  const [showMenu, setShowMenu] = useState(false)
  const path = usePathname()
  const router = useRouter()

  const isDiscover = useMemo(() => {
    return path === "/discover"
  }, [path])

  useEffect(() => {
    setShowMenu(false)
  }, [path])

  return (
    <div className="relative flex items-center justify-between gap-4 px-4 py-2 sm:px-8 sm:py-6">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="shrink-0 cursor-pointer select-none rounded-full p-2.5 shadow-menuShadow sm:p-4"
          onClick={() => setShowMenu(!showMenu)}
        >
          <Image
            className="h-6 w-6 sm:h-10 sm:w-10"
            priority
            src={Channel4Icon}
            alt="Channel 4 icon black"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium">
            {isDiscover
              ? isLoading
                ? "Loading sites..."
                : currentSite?.title ?? "Site name not avaialable."
              : "Weclome to Channel 4"}
          </div>
          {isDiscover && !isLoading && (
            <div className="truncate text-xs text-shark-300">See details</div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-8">
        {isDiscover && !isLoading && (
          <div className="relative flex cursor-pointer items-center gap-2 text-sm">
            <Image alt="Like" className="h-4 w-4" src={EmptyHeart} />
            <div>{currentSite?.likes}</div>
          </div>
        )}
        <Button
          className="h-auto bg-c4-gradient-green px-6 py-2 hover:bg-c4-gradient-green-rev sm:px-16"
          onClick={() =>
            isDiscover && changeSite ? changeSite() : router.push("discover")
          }
        >
          {isDiscover ? "Next" : "Start watching"}
        </Button>
      </div>
      <MainMenu onClose={() => setShowMenu(false)} open={showMenu} />
    </div>
  )
}

export default Toolbar
