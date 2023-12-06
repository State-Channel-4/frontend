import Link from "next/link"
import { Tag } from "@/types"

import { random } from "@/app/utils"

const fetchTags = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tag`, {
    next: { revalidate: 0 },
  })
  const { tags } = await res.json()
  return tags as Tag[]
}

const Browse = async () => {
  const tags = await fetchTags()
  return (
    <div>
      <div className="p-4 md:p-10 sticky top-0 z-10 bg-shark-950">
        <div className="bg-c4-gradient-green text-[56px] font-extrabold leading-none bg-clip-text text-transparent w-fit">
          Topics
        </div>
        <div className="text-lg text-shark-50 mt-2">
          Your channel guides for various topics. Select one of following &
          let’s start watching
        </div>
      </div>
      <div className="h-full overflow-auto">
        {tags
          .filter(({ __v }) => !!__v)
          .map(({ name, __v }) => (
            <Link
              className="cursor-pointer flex items-center py-4 px-10 border-y border-shark-500 hover:border-c4-green justify-between relative gap-6"
              href={`discover?tag=${name}`}
            >
              <div className="text-xl text-shark-50 truncate">{name}</div>
              <div
                className="w-px bg-c4-green absolute h-full z-[-1]"
                style={{
                  left: `${random(25, 89)}%`,
                }}
              />
              <div className="text-c4-green text-xl">{__v}</div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default Browse
