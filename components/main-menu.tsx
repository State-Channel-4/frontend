import Image from "next/image"
import Link from "next/link"
import xIcon from "@/assets/x-icon.svg"

interface MainMenuProps {
  onClose: () => void
}

const LINKS = [
  { link: "/sign-in", name: "Sign In / Sign Up" },
  { link: "/stats", name: "Stats" },
  { link: "/about", name: "About" },
]

export default function MainMenu({ onClose }: MainMenuProps) {
  return (
    <div className="absolute sm:left-10 left-4 sm:bottom-[calc(100%+8px)] bottom-[calc(100%)] w-[351px] rounded-2xl bg-shark-950 p-6">
      <div className="mb-10">
        {LINKS.map(({ link, name }) => (
          <Link href={link}>
            <div className="hover:text-shark-200 text-shark-300 transition-all p-4 border-b border-shark-800 hover:border-green">
              {name}
            </div>
          </Link>
        ))}
      </div>
      <div
        className="cursor-pointer hover:text-shark-200 hover:text-shark-200 text-shark-300 transition-colors p-4 flex items-center justify-between"
        onClick={() => onClose()}
      >
        <div>Close menu</div>
        <Image alt="X" src={xIcon} />
      </div>
    </div>
  )
}
