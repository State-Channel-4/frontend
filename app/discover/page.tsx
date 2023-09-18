"use client"

import Link from "next/link"
import { usePasswordStore } from "@/store/password"
import { ExternalLink, Tag } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import TagList from "@/components/ui/tag-list"
import LikeButton from "@/components/like-button"

import useMix from "../hooks/useMix"
import SiteFrame from "./SiteFrame"
import { feedbackMessages } from "./utils"

const Discover = () => {
  const { password, token, userId } = usePasswordStore()
  const { currentSite, isLoading, error, userLikes, likeOrUnlike } = useMix()

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
      <section className="container grid grid-cols-1 gap-10 pb-8 pt-6 xl:grid-cols-3">
        <div className="col-span-1 xl:col-span-2">
          <SiteFrame site={currentSite} />
        </div>
        <div className="col-span-1 flex max-w-[900px] flex-col items-start justify-end gap-4">
          {currentSite && (
            <div className="flex w-full flex-col gap-1 rounded-lg">
              <p className="font-mono text-sm uppercase tracking-widest text-yellow-300">
                now showing
              </p>
              <p className="text-2xl font-semibold">{currentSite?.title}</p>
              <p className="text-sm text-primary/70">
                by {currentSite?.submittedBy}
              </p>
              <p className="p-2"></p>
              <div className="flex items-center gap-2">
                <LikeButton
                  likeOrUnlike={likeOrUnlike}
                  userLikes={userLikes}
                  signedIn={password && token && userId ? true : false}
                  site={currentSite}
                />

                <Link
                  href={currentSite?.url}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant={"ghost"} size="sm">
                    Go to site
                    <ExternalLink size={16} aria-label="Go to site" />
                  </Button>
                </Link>
              </div>

              <p className="p-1"></p>

              {/* <Button
                className={cn(
                  buttonVariants({ size: "lg", variant: "default" }),
                  "rounded-full font-bold uppercase transition-all duration-500 active:scale-75 disabled:cursor-not-allowed disabled:text-primary disabled:opacity-50"
                )}
                loading={isLoading}
                loadingText="Checking for more content"
                role="button"
                aria-label="Next"
                onClick={changeSite}
              >
                Watch something else
              </Button> */}
              <p className="p-1"></p>
              <hr className="h-1 w-full border bg-c4-gradient-main" />
            </div>
          )}
          {currentSite.tags.length > 0 && (
            <TagList
              tags={new Map(currentSite?.tags.map((tag) => [tag._id, tag]))}
              selectable={false}
              title="Tags"
            />
          )}
        </div>
      </section>
    )
  )
}

export default Discover
