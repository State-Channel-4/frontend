import Link from "next/link"
import { Tag } from "@/types"

import { random } from "@/app/utils"

const fetchTags = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
    cache: "no-store",
  })
  const { tags } = await res.json()
  return tags as Tag[]
}

const Browse = async () => {
  const tags = await fetchTags()
  return (
    <div>
      <div className="sticky top-0 z-10 bg-shark-950 p-4 md:p-10">
        <div className="w-fit bg-c4-gradient-green bg-clip-text text-[56px] font-extrabold leading-none text-transparent">
          Topics
        </div>
        <div className="mt-2 text-lg text-shark-50">
          Your channel guides for various topics. Select one of following &
          let’s start watching
        </div>
      </div>
      <div className="h-full overflow-auto">
        {tags
          .filter(({ __v }) => !!__v)
          .map(({ name, __v }) => (
            <Link
              className="relative flex cursor-pointer items-center justify-between gap-6 border-y border-shark-500 px-10 py-4 hover:border-c4-green"
              href={`discover?tag=${name}`}
            >
              <div className="truncate text-xl text-shark-50">{name}</div>
              <div
                className="absolute z-[-1] h-full w-px bg-c4-green"
                style={{
                  left: `${random(25, 89)}%`,
                }}
              />
              <div className="text-xl text-c4-green">{__v}</div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Browse
