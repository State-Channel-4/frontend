"use client"

import Link from "next/link"
import { C4Content } from "@/types"

import { Button } from "@/components/ui/button"

import SiteFrame from "./SiteFrame"
import { feedbackMessages } from "./utils"

interface DiscoverPageProps {
  currentSite: C4Content | null
  error: {
    message: string
  }
  isLoading: boolean
}

const Discover = ({ currentSite, error, isLoading }: DiscoverPageProps) => {
  if (error.message !== "") {
    return (
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-3 p-6">
        <p className="text-lg">{feedbackMessages["not-found"]}</p>
        <Link href="/" passHref>
          <Button variant={"default"} size="lg">
            Go home
          </Button>
        </Link>
      </div>
    )
  }
  if (isLoading) {
    return (
      <p className="mx-auto flex w-full items-center justify-center p-6">
        {feedbackMessages.loading}
      </p>
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
