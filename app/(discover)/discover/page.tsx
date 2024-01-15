"use client"

import Link from "next/link"
import { C4Content } from "@/types"

import { Button } from "@/components/ui/button"

import SiteFrame from "./SiteFrame"
import { feedbackMessages } from "./utils"

interface DiscoverPageProps {
  params: {
    currentSite: C4Content | null
    error: {
      message: string
    }
    isLoading: boolean
  }
}

const Discover = ({
  params: { currentSite, error, isLoading },
}: DiscoverPageProps) => {
  if (error.message !== "") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center space-y-3 p-6">
        <p className="text-lg">{feedbackMessages["not-found"]}</p>
        <Link href="/browse" passHref>
          <Button variant="default" size="lg">
            Back to Browse
          </Button>
        </Link>
      </div>
    )
  }
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="mx-auto flex w-full items-center justify-center p-6">
          {feedbackMessages.loading}
        </p>
      </div>
    )
  }

  return (
    !isLoading &&
    !error.message &&
    currentSite && (
      <section className="h-full">
        <SiteFrame site={currentSite} />
      </section>
    )
  )
}

export default Discover
