import { random } from "@/app/utils"

const TOPICS = [
  { title: "Gaming", uses: 24 },
  { title: "Retro", uses: 23 },
  { title: "Data", uses: 1 },
  { title: "Books", uses: 2 },
  { title: "Food", uses: 56 },
  { title: "Books", uses: 2 },
  { title: "Music", uses: 99 },
  { title: "Gadget", uses: 72 },
  { title: "Travel", uses: 22 },
  { title: "Phone", uses: 24 },
  { title: "Zero Knowledge", uses: 45 },
  { title: "Cryptography", uses: 67 },
  { title: "MEV", uses: 102 },
  { title: "Money", uses: 53 },
  { title: "Lifestyle", uses: 83 },
]

const Browse = () => {
  return (
    <div>
      <div className="p-10">
        <div className="bg-c4-gradient-green text-[56px] font-extrabold leading-none bg-clip-text text-transparent w-fit">
          Topics
        </div>
        <div className="text-lg text-shark-50 mt-2">
          Your channel guides for various topics. Select one of following &
          let’s start watching
        </div>
      </div>
      <div className="h-[400px] overflow-auto">
        {TOPICS.map(({ title, uses }, index) => (
          <div className="flex items-center py-4 px-10 border-y border-shark-500 justify-between relative">
            <div className="text-xl text-shark-50">{title}</div>
            <div
              className="w-px bg-c4-green absolute h-full"
              style={{
                left: `${random(25, 89)}%`,
              }}
            />
            <div className="text-c4-green text-xl">{uses}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Browse
