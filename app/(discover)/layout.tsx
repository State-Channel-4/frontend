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
  const { changeSite, currentSite, error, isLoading } = useMix()

  return (
    <>
      <MainContentWrapper>
        <Discover
          currentSite={currentSite}
          error={error}
          isLoading={isLoading}
        />
      </MainContentWrapper>
      <Toolbar
        changeSite={changeSite}
        currentSite={currentSite}
        isLoading={isLoading}
      />
    </>
  )
}
