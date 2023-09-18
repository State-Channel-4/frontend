"use client"

import { useState } from "react"
import { Tag, TagMap } from "@/types"
import { Loader2 } from "lucide-react"
import useSWR from "swr"

import TagList from "@/components/ui/tag-list"

const getTags = async () => {
  try {
    // TODO: Tags should only return tags that have links
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/tag")
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}

export default function IndexPage() {
  const [tags, setTags] = useState<TagMap>(new Map())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useSWR("tag", getTags, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    onError: (error) => {
      console.log(error)
      setIsLoading(false)
    },
    onSuccess: (data) => {
      let _tags: TagMap = new Map()
      if (data && "tags" in data) {
        data.tags.forEach((tag: Tag) => {
          _tags.set(tag._id, { _id: tag._id, name: tag.name })
        })
        setTags(_tags)
        setIsLoading(false)
      }
    },
  })

  return (
    <section className="container grid items-center gap-6 py-8">
      {/* <div className="flex max-w-[800px] flex-col items-start space-y-3">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
          Your journey starts here!
        </h1>
        <p className="max-w-[800px] text-lg text-foreground sm:text-xl">
          Get ready to see random content from all over the internet.
        </p>
      </div>
      {isLoading ? (
        <div className="flex space-x-2">
          <Loader2 className={"animate-spin"} />
          <p>Getting tags...</p>
        </div>
      ) : (<TagList
        tags={tags}
        title={"Choose some tags (optional)"}
        selectable
      />)} */}
    </section>
  )
}
