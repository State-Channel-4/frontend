import Link from "next/link"
import { C4Content } from "@/types"
import { ThumbsUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

interface LikeButtonProps {
  signedIn: boolean
  likeOrUnlike: (contentId: string, liked: boolean) => void
  site: C4Content | null
  userLikes: string[]
}

const LikeButton = ({
  signedIn,
  likeOrUnlike,
  site,
  userLikes,
}: LikeButtonProps) => {
  if (!site) return null
  const isLiked = userLikes.includes(site?._id)

  const LikeButtonContent = () => (
    <Button
      variant="secondary"
      size="sm"
      className="group inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm transition-all duration-300"
      onClick={signedIn ? (e) => likeOrUnlike(site._id, !isLiked) : undefined}
    >
      <ThumbsUpIcon
        size={16}
        className={cn(
          "transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-yellow-300",
          isLiked && "text-yellow-300"
        )}
        aria-label="Like"
      />
      <p>{isLiked ? "Liked" : "Like"}</p>
      <p>•</p>
      <p>{site.likes}</p>
    </Button>
  )

  if (signedIn) {
    return <LikeButtonContent />
  } else {
    return (
      <Popover>
        <PopoverTrigger>
          <LikeButtonContent />
        </PopoverTrigger>
        <PopoverContent
          className="flex w-full rounded-xl bg-c4-gradient-blue px-2 py-1"
          side="top"
        >
          <Link href="/sign-in" passHref>
            <Button variant={"link"} size={"sm"}>
              Sign in to like
            </Button>
          </Link>
        </PopoverContent>
      </Popover>
    )
  }
}

export default LikeButton
