"use client"

import { usePasswordStore } from "@/store/password"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import TagList from "@/components/ui/tag-list"
import { cn } from "@/lib/utils"

import LikeButton from "@/components/like-button"
import useMix from "../hooks/useMix"
import SiteFrame from "./SiteFrame"
import { feedbackMessages } from "./utils"

const Discover = () => {
  const { password, token, userId } = usePasswordStore()
  const { currentSite, isLoading, error, userLikes, likeOrUnlike, changeSite, selectedTags, hasNextPage, mixEnded } = useMix();

  if (error.message !== "") {
    return (
      <p className="mx-auto flex w-full items-center justify-center p-6">
        {feedbackMessages["not-found"]}
      </p>
    )
  }
  if (isLoading) {
    return (
      <p className="mx-auto flex w-full items-center justify-center p-6">
        {feedbackMessages.loading}
      </p>
    )
  }
  if (!selectedTags.current || selectedTags.current.size === 0) {
    return (
      <p className="mx-auto flex w-full items-center justify-center p-6">
        {feedbackMessages["no-tags"]}
      </p>
    )
  }


  return (
    currentSite && (<section className="container grid grid-cols-1 gap-10 pb-8 pt-6 xl:grid-cols-3">
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
            <p className="text-primary/70 text-sm">
              by {currentSite?.submittedBy}
            </p>
            <p className="p-2"></p>
            <div className="flex items-center gap-2">
              <LikeButton likeOrUnlike={likeOrUnlike} userLikes={userLikes} signedIn={password && token && userId ? true : false} site={currentSite} />
            </div>

            <p className="p-1"></p>

            <Button
              className={cn(
                buttonVariants({ size: "lg", variant: "default" }),
                "rounded-full font-bold uppercase transition-all duration-500 active:scale-75 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-primary"
              )}
              disabled={mixEnded || false}
              loading={isLoading}
              loadingText="Checking for more content"
              role="button"
              aria-label="Next"
              onClick={changeSite}
            >
              {!mixEnded ? 'Watch something else' : 'Mix ended, choose other tags'}
            </Button>
            <p className="p-1"></p>
            <hr className="bg-c4-gradient-main h-1 w-full border" />
          </div>
        )}

        {selectedTags.current.size > 0 && (
          <>
            <p className="text-primary text-xs uppercase tracking-widest">
              viewing shows from
            </p>
            <TagList tags={selectedTags.current} />
            <Link href="/" passHref>
              <Button variant={"ghost"} size="sm">
                Choose other tags
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
    ))
}

export default Discover