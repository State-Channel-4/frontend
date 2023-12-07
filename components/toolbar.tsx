"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import EmptyHeart from "@/assets/empty-heart.svg"
import FilledHeart from "@/assets/filled-heart.svg"
import { useAuth } from "@/contexts/AuthContext"
import { C4Content } from "@/types"

import Channel4Icon from "../assets/channel-4-icon-v2.svg"
import MainMenu from "./main-menu"
import SiteDetails from "./site-details"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface ToolbarProps {
  changeSite?: () => void
  currentSite?: C4Content | null
  isLoading?: boolean
  likeOrUnlike?: (contentId: string) => void
  userLikes?: string[]
}

const Toolbar = ({
  changeSite,
  currentSite,
  isLoading,
  likeOrUnlike,
  userLikes,
}: ToolbarProps) => {
  const { signedIn } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showSiteDetails, setShowSiteDetails] = useState(false)
  const path = usePathname()
  const router = useRouter()

  const isDiscover = useMemo(() => {
    return path === "/discover"
  }, [path])

  const hasLiked = useMemo(() => {
    if (!signedIn || !currentSite || !userLikes) return false
    return userLikes.includes(currentSite._id)
  }, [currentSite, signedIn, userLikes])

  const labelText = useMemo(() => {
    // Map route to toolbar label
    const labelMap: { [path: string]: string } = {
      "/browse": "Browse topics",
      "/dashboard": "Dashboard",
      "/landing": "Welcome to Channel 4",
      "/submit-url": "Add a website",
    }

    if (isDiscover) {
      return isLoading
        ? "Loading sites..."
        : currentSite?.title ?? "Site name not avaialable."
    }
    return labelMap[path]
  }, [currentSite, isDiscover, isLoading, path])

  const togglePopup = (option: string) => {
    if (option === "navigation") {
      setShowMenu(!showMenu)
      setShowSiteDetails(false)
    } else {
      setShowSiteDetails(!showSiteDetails)
      setShowMenu(false)
    }
  }

  useEffect(() => {
    setShowMenu(false)
  }, [path])

  return (
    <div className="relative flex items-center justify-between gap-4 px-4 py-2 md:px-8 md:py-6">
      <div className="flex min-w-0 items-center gap-4">
        <div
          className="shrink-0 cursor-pointer select-none rounded-full p-2.5 shadow-menuShadow duration-500 ease-in-out hover:-translate-y-1 hover:shadow-c4-green/70 active:scale-90 md:p-4"
          onClick={() => togglePopup("navigation")}
          title="Menu"
        >
          <Image
            className="h-6 w-6 md:h-10 md:w-10"
            priority
            src={Channel4Icon}
            alt="Channel 4 icon black"
          />
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium">{labelText}</div>
          {isDiscover && !isLoading && (
            <button
              className="truncate text-xs text-shark-300"
              onClick={() => togglePopup("site-details")}
            >
              {showSiteDetails ? "Hide details" : "See details"}
            </button>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-8">
        {isDiscover && !isLoading && (
          <Popover>
            <PopoverTrigger
              className="relative flex cursor-pointer items-center gap-2 text-sm disabled:cursor-not-allowed"
              onClick={() => {
                if (!signedIn) return
                currentSite && likeOrUnlike && likeOrUnlike(currentSite._id)
              }}
            >
              {/* TODO: Replace with single SVG image that can be colored */}
              <Image
                alt="Like"
                className="h-4 w-4"
                src={hasLiked ? FilledHeart : EmptyHeart}
              />
              <div>{currentSite?.likes}</div>
            </PopoverTrigger>
            {!signedIn && (
              <PopoverContent
                className="w-fit rounded-lg border border-shark-800 bg-shark-950 p-4 text-center text-sm text-shark-50"
                side="top"
                sideOffset={15}
              >
                Please sign in to like this.
              </PopoverContent>
            )}
          </Popover>
        )}
        <Button
          className="h-auto bg-c4-gradient-green px-6 py-2 duration-200 ease-out hover:translate-x-1 hover:bg-c4-gradient-green-rev md:px-16"
          onClick={() =>
            isDiscover && changeSite ? changeSite() : router.push("discover")
          }
        >
          {isDiscover ? "Next" : "Start watching"}
        </Button>
      </div>
      <MainMenu onClose={() => setShowMenu(false)} open={showMenu} />
      {isDiscover && currentSite && (
        <SiteDetails
          currentSite={currentSite}
          open={showSiteDetails}
          onClose={() => setShowSiteDetails(false)}
        />
      )}
    </div>
  )
}

export default Toolbar
