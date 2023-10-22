"use client"

import MainContentWrapper from "@/components/main-content-wrapper"
import Toolbar from "@/components/toolbar"
import useMix from "@/app/hooks/useMix"

import Discover from "./discover/page"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { changeSite, currentSite, error, isLoading, likeOrUnlike } = useMix()

  return (
    <>
      <MainContentWrapper>
        <Discover params={{ currentSite, error, isLoading }} />
      </MainContentWrapper>
      <Toolbar
        changeSite={changeSite}
        currentSite={currentSite}
        isLoading={isLoading}
        likeOrUnlike={likeOrUnlike}
      />
    </>
  )
}
